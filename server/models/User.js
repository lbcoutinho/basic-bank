// Encrypt reference: https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
const mongoose = require('mongoose');
const { Schema } = mongoose;
// const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  googleId: { type: String, unique: true },
  givenName: String,
  fullName: String,
  email: String,
  phone: String,
  firstAccess: {type: Boolean, default: true},
  password: String
});

// userSchema.pre('save', function(next) {
//   var user = this;

//   // Only hash the password if it has been modified (or is new)
//   if (!user.isModified('password')) return next();

//   // Generate a salt
//   bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//     if (err) return next(err);

//     // Hash the password using our new salt
//     bcrypt.hash(user.password, salt, function(err, hash) {
//       if (err) return next(err);

//       // override the cleartext password with the hashed one
//       user.password = hash;
//       next();
//     });
//   });
// });

// userSchema.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

mongoose.model('users', userSchema);
