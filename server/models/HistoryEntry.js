const mongoose = require('mongoose');
const { Schema } = mongoose;

const historyEntrySchema = new Schema({
  origin: { type: Schema.Types.ObjectId, ref: 'User' },
  destination: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, default: 0 },
  date: Date
});

module.exports = historyEntrySchema;
