const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  guid: {
    type: String,
    unique: true,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Token', TokenSchema);
