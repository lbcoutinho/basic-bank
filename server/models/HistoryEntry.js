const mongoose = require('mongoose');
const { Schema } = mongoose;

const historyEntrySchema = new Schema({
  sentTo: { type: Schema.Types.ObjectId, ref: 'users' },
  receivedFrom: { type: Schema.Types.ObjectId, ref: 'users' },
  description: String,
  amount: { type: Number, default: 0 },
  date: Date
});

module.exports = historyEntrySchema;
