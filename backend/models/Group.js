// models/Group.js
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: String,
  members: [{ type: String, ref: 'User' }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }]
});

module.exports = mongoose.model('Group', GroupSchema,"groups");