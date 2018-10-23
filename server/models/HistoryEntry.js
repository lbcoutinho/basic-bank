const mongoose = require('mongoose');
const { Schema } = mongoose;

const historyEntrySchema = new Schema({
  sentTo: { type: Schema.Types.ObjectId, ref: 'User' },
  receivedFrom: { type: Schema.Types.ObjectId, ref: 'User' },
  description: String,
  amount: { type: Number, default: 0 },
  date: Date
});

module.exports = historyEntrySchema;
