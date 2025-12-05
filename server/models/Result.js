const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  name: String,
  email: String,
  score: Number,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Result", ResultSchema);
