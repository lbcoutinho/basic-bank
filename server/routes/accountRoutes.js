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
      contacts: false,
      history: false
    });

    response.origin = { number: originAccount.number };

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
      response.destination = { name: destinationUser.fullName, number: destinationAccount.number };
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
  // Currently implementation is not atomic
  // TODO add operation to history
  app.put('/api/account/transfer', requireLogin, async (req, res) => {
    const value = new Number(req.body.value);
    // if (req.body.useCreditCard) {
    //   const card = await CreditCard.findOne({ user: req.user.id });
    //   card.totalSpent += value;
    //   card.save();
    // } else {
    //   const origin = await Account.findOne({ number: req.body.origin.number });
    //   origin.balance -= value;
    //   origin.save();
    // }

    // const destination = await Account.findOne({ number: req.body.destination.number });
    // destination.balance += value;
    // destination.save();

    await Account.updateOne({ user: req.user.id }, { $push: { history: {} } }).exec();

    res.send({});
  });
};
