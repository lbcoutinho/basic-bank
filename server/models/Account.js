const mongoose = require('mongoose');
const { Schema } = mongoose;
const HistoryEntry = require('./HistoryEntry');

const accountSchema = new Schema({
  number: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  balance: { type: Number, default: 0 },
  contacts: [Schema.Types.ObjectId],
  history: [HistoryEntry]
});

mongoose.model('accounts', accountSchema);
