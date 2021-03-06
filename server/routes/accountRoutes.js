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
    try {
      const contacts = await Account.findOne({ user: req.user.id })
        .select({ contacts: true })
        .populate('contacts', ['fullName', 'email'])
        .exec();
      res.send(contacts);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // Add new contact to user account
  app.post('/api/account/contact', requireLogin, async (req, res) => {
    const { email } = req.body;
    const contact = await User.findOne({ email });
    if (contact) {
      const exists = (await Account.count({ contacts: mongoose.Types.ObjectId(contact._id) })) > 0;
      // Check if user is already in contacts list
      if (!exists) {
        await Account.updateOne({ user: req.user.id }, { $push: { contacts: contact._id } }).exec();
        res.status(204).send();
      } else {
        res.status(400).send(`${contact.fullName} is already a contact.`);
      }
    } else {
      res.status(404).send('User not found');
    }
  });

  // Delete contact by id
  app.delete('/api/account/contact/:id', requireLogin, async (req, res) => {
    await Account.updateOne({ user: req.user.id }, { $pull: { contacts: req.params.id } }).exec();
    res.status(204).send();
  });

  // Perform validations before transfer
  app.put('/api/account/validate-transfer', requireLogin, async (req, res) => {
    const response = {};

    // Get current user account info
    const originAccount = await Account.findOne({ user: req.user.id }).select({
      number: true,
      balance: true
    });

    response.origin = {
      userId: req.user.id,
      name: req.user.fullName,
      number: originAccount.number
    };

    // Get destination user and account info
    const destinationAccount = await Account.findOne({ user: req.body.destination })
      .select({
        user: true,
        number: true
      })
      .populate('user', ['_id', 'fullName'])
      .exec();

    response.destination = {
      userId: destinationAccount.user._id,
      name: destinationAccount.user.fullName,
      number: destinationAccount.number
    };

    // Get value from request body
    const value = new Number(req.body.value);
    response.value = value;

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
  /**
   * Expected input:
   * {
   *   "origin": {
   *       "userId": "5bce73076b90e6f",
   *       "name": "User 1",
   *       "number": "8605"
   *   },
   *   "value": 100,
   *   "destination": {
   *       "userId": "5bce1fa3b05d52b",
   *       "name": "User 2",
   *       "number": "4892"
   *   },
   *   "creditCardId": "5bce1fa3b05d52b" // Message will contain this param if account balance is insufficient
   * }
   */
  app.put('/api/account/transfer', requireLogin, async (req, res) => {
    const { origin, destination, creditCardId } = req.body;
    const value = new Number(req.body.value);
    const date = new Date();

    // Check if useCreditCard value is present in the request
    const historyEntry = {
      sentTo: destination.userId,
      description: `Transfer sent to ${destination.name}`,
      amount: -value,
      date
    };

    if (creditCardId) {
      await CreditCard.updateOne(
        { _id: creditCardId },
        {
          $inc: { totalSpent: value },
          $push: { history: historyEntry }
        }
      ).exec();
    } else {
      await Account.updateOne(
        { number: origin.number },
        {
          $inc: { balance: -value },
          $push: { history: historyEntry }
        }
      ).exec();
    }

    await Account.updateOne(
      { number: destination.number },
      {
        $inc: { balance: value },
        $push: {
          history: {
            receivedFrom: origin.userId,
            description: `Transfer received from ${origin.name}`,
            amount: value,
            date
          }
        }
      }
    ).exec();

    res.status(204).send();
  });
};
