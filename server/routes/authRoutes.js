const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    // Authenticate user using 'google' passport strategy
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    // Authenticate user using 'google' passport strategy
    passport.authenticate('google'),
    // Redirect to /home after authentication
    (req, res) => {
      if (req.user && req.user.firstAccess) {
        res.redirect('/password/new');  
      } else {
        res.redirect('/home');
      }
    }
  );

  // Logout user and redirect to root
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
