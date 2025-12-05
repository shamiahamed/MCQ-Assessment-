const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const Result = require('./models/Result');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Mongo error:", err));

// API route
app.post("/api/result", async (req, res) => {
  try {
    const r = new Result(req.body);
    await r.save();
    res.json({ msg: "saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error saving result" });
  }
});

// for Vercel (NO app.listen)
module.exports = app;
module.exports.handler = serverless(app);
