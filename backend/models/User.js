const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid:{
      type: String,
      required: true
    },
    username: {
     type: String,
     required: true
    },
    email: {
     type: String,
     required: true
    },
    password: {
     type: String,
     required: true
    },
    netBalance: {
     type: Number,
     default: 0
    },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
  });

module.exports = mongoose.model("User", userSchema, "users")