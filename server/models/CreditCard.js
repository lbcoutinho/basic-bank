const mongoose = require('mongoose');
const { Schema } = mongoose;
const HistoryEntry = require('./HistoryEntry');

const creditCardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  expirationMonth: Number,
  expirationYear: Number,
  number: { type: String, unique: true },
  flag: { type: String, enum: ['Visa', 'Master'] },
  totalSpent: { type: Number, default: 0 },
  history: [HistoryEntry]
});

mongoose.model('creditCards', creditCardSchema);
