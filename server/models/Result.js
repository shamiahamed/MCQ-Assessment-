const mongoose = require('mongoose');

module.exports = mongoose.model("Result",
 new mongoose.Schema({
  name: String,
  email: String,
  score: Number,
  total: Number,
  timeTaken: Number,
  status:{ type: String },
  createdAt:{ type: Date, default: Date.now }
}));
