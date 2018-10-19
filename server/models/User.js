const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  contacts: [Schema.Types.ObjectId]
});

mongoose.model('users', userSchema);
