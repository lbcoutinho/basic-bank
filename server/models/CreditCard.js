const mongoose = require('mongoose');
const { Schema } = mongoose;

const creditCardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  expirationMonth: String,
  expirationYear: String,
  number: { type: String, unique: true },
  flag: { type: String, enum: ['Visa', 'Master'] },
  totalSpent: { type: Number, default: 0 },
  history: [HistoryEntry
});

mongoose.model('creditCards', creditCardSchema);
