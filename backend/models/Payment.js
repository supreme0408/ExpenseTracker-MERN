// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  payer: { type: String, ref: 'User' },
  amount: Number,
  description: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema,"payments");