// backend/models/Transaction.js
const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  uid: {
    type: String,
    ref: 'User',
    required: true
  },
  type:{
    type: String,
    required:true
  },
  amount: {
   type: Number,
   default: 0
  },
  category:{
    type:String
  },
  date:{
    type:Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Transaction', transactionSchema,"transactions");;