const mongoose = require('mongoose');
const { Schema } = mongoose;
const HistoryEntry = require('./HistoryEntry');

const accountSchema = new Schema({
  number: String,
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  balance: { type: Number, default: 0 },
  contacts: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  history: [HistoryEntry]
});

mongoose.model('accounts', accountSchema);
