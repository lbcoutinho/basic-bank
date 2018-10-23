const requireLogin = require('../middlewares/requireLogin');

const mongoose = require('mongoose');
const CreditCard = mongoose.model('creditCards');

function generateCreditCardNumber() {
  let number = '';
  while (number.length < 16) {
    const num = Math.floor(Math.random() * 10000);
    if (num < 1000) continue;
    else number += num.toString() + ' ';
  }
  return number.trim();
}

module.exports = app => {
  // Get all credit cards by current user id
  app.get('/api/credit-card', requireLogin, async (req, res) => {
    const cards = await CreditCard.find({ user: req.user.id }).select({
      history: false
    });
    res.send(cards);
  });

  // Get single credit card by id
  app.get('/api/credit-card/:id', requireLogin, async (req, res) => {
    res.send(await CreditCard.findById(req.params.id));
  });

  // Create new credit card for current user
  app.post('/api/credit-card', requireLogin, async (req, res) => {
    const { flag } = req.body;
    const currentDate = new Date();

    try {
      await new CreditCard({
        user: req.user.id,
        expirationMonth: currentDate.getMonth() + 1,
        expirationYear: currentDate.getFullYear() + 4,
        number: generateCreditCardNumber(),
        flag
      }).save();

      res.status(204).send();
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // Delete credit card by id
  app.delete('/api/credit-card/:id', requireLogin, async (req, res) => {
    await CreditCard.deleteOne({ _id: req.params.id });
    res.status(204).send();
  });
};
