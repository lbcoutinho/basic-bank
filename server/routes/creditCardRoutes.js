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
  // Get credit card by current user id
  app.get('/api/credit-card', requireLogin, async (req, res) => {
    const cards = await CreditCard.find({ user: req.user.id }).select({
      history: false
    });
    res.send(cards);
  });

  // Create new credit card for current user
  app.post('/api/credit-card', requireLogin, async (req, res) => {
    const { flag } = req.body;
    const currentDate = new Date();

    try {
      const card = await new CreditCard({
        user: req.user.id,
        expirationMonth: currentDate.getMonth() + 1,
        expirationYear: currentDate.getFullYear() + 4,
        number: generateCreditCardNumber(),
        flag
      }).save();

      res.send(card);
    } catch (err) {
      res.status(400).send(err);
    }
  });
};
