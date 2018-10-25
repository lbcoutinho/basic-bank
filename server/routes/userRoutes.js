const requireLogin = require('../middlewares/requireLogin');

const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = app => {
  // Return current logged in user model
  app.get('/api/logged-in-user', (req, res) => {
    res.send(req.user ? req.user : '');
  });

  app.post('/api/user/password', requireLogin, async (req, res) => {
    const user = await User.findOne({ _id: req.user.id });
    user.firstAccess = false;
    user.password = req.body.password;
    user.save();
    user.password = null;
    res.send(user);
  });
};
