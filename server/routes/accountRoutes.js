const requireLogin = require('../middlewares/requireLogin');

const mongoose = require('mongoose');
const Account = mongoose.model('accounts');
const User = mongoose.model('users');
const CreditCard = mongoose.model('creditCards');

const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

module.exports = app => {
  // Get account by current user id
  app.get('/api/account', requireLogin, async (req, res) => {
    const acc = await Account.findOne({ user: req.user.id }).select({
      contacts: false
    });
    res.send(acc);
  });

  // Get account contacts
  app.get('/api/account/contact', requireLogin, async (req, res) => {
    res.send(await Account.findOne({ user: req.user.id }).select({ contacts: true }));
  });

  // Add new contact to user account
  app.post('/api/account/contact', requireLogin, async (req, res) => {
    const { email } = req.body;
    const contact = await User.findOne({ email });
    if (contact) {
      await Account.updateOne({ user: req.user.id }, { $push: { contacts: contact._id } }).exec();
      return res.send({});
    } else {
      res.status(404).send('User not found');
    }
  });

  // Perform validations before transfer
  app.put('/api/account/validate-transfer', requireLogin, async (req, res) => {
    const response = {};

    // Get current user account
    const originAccount = await Account.findOne({ user: req.user.id }).select({
      number: true, balance: true
    });

    response.origin = { userId: req.user.id, name: req.user.fullName, number: originAccount.number };

    // Get value from request body
    const value = new Number(req.body.value);
    response.value = value;

    // Check if destination is valid
    let destinationAccount;
    const { destination } = req.body;

    if (emailRegex.test(destination)) {
      const destinationUser = await User.findOne({ email: destination }).select({
        _id: true
      });
      // Get destination user account
      if (destinationUser) {
        destinationAccount = await Account.findOne({ user: destinationUser._id }).select({
          contacts: false,
          history: false
        });
      }
    } else if (destination.length == 4) {
      const accountNumber = new Number(destination);
      if (!Number.isNaN(accountNumber)) {
        destinationAccount = await Account.findOne({ number: accountNumber }).select({
          contacts: false,
          history: false
        });
      }
    }

    if (destinationAccount) {
      const destinationUser = await User.findOne({ _id: destinationAccount.user });
      response.destination = { userId: destinationUser._id, name: destinationUser.fullName, number: destinationAccount.number };
    } else {
      // Abort validation if destination is invalid
      response.invalidDestination = 'Invalid destination account';
      res.send(response);
      return;
    }

    // Check current user account balance
    if (originAccount.balance < value) {
      // Check if user has credit card
      if ((await CreditCard.count({ user: req.user.id })) > 0) {
        response.useCreditCard =
          'Insufficient account balance. Do you want to use your credit card?';
      } else {
        response.noFunds = 'Insufficient account balance. Do you want to create a new credit card?';
      }
    }

    res.send(response);
  });

  // Performs transfer operation
  // Obs: Currently implementation is not atomic
  // Expected input:
  //   {
  //     "origin": {
  //         "userId": "5bce73076b90e6f",
  //         "name": "User 1",
  //         "number": "8605"
  //     },
  //     "value": 100,
  //     "destination": {
  //         "userId": "5bce1fa3b05d52b",
  //         "name": "User 2",
  //         "number": "4892"
  //     },
  //     "useCreditCard": "message" // Message will contain this param if account balance is insufficient
  // }
  app.put('/api/account/transfer', requireLogin, async (req, res) => {

    const { origin, destination, useCreditCard } = req.body;
    const value = new Number(req.body.value);
    const date = new Date();

    // Check if useCreditCard value is present in the request
    const historyEntry = { sentTo: destination.userId, description: `Transfer sent to ${destination.name}`, amount: -value, date };
    if (useCreditCard) {
      await CreditCard.updateOne({ user: origin.userId }, {
        $inc: { totalSpent: value },
        $push: { history: historyEntry }
      }).exec();
    } else {
      await Account.updateOne({ number: origin.number }, {
        $inc: { balance: -value },
        $push: { history: historyEntry }
      }).exec();
    }

    await Account.updateOne({ number: destination.number }, {
      $inc: { balance: value },
      $push: { history: { receivedFrom: origin.userId, description: `Transfer received from ${origin.name}`, amount: value, date } }
    }).exec();

    res.status(204).send();
  });
};
