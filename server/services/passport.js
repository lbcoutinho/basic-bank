const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');
const Account = mongoose.model('accounts');
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  // Setup GoogleStrategy in passport
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    // Callback function that runs after successful authentication
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id }).select({ password: false });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({
        googleId: profile.id,
        givenName: profile.name.givenName,
        fullName: profile.displayName,
        email: profile.emails[0].value
      }).save();

      // Create account on user first access. Account number is generated randomly
      await new Account({
        user: user._id,
        number: Math.floor(Math.random() * 10000).toString(),
        balance: 1000 // Initial balance set for test purposes
      }).save();

      done(null, user);
    }
  )
);
