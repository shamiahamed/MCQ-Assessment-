const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const Result = require('./models/Result');

const app = express();
app.use(cors());
app.use(express.json());

// ---------- MONGODB CONNECTION ----------
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mcqdb";

mongoose.connect(mongoURI)
  .then(() => console.log(`✅ MongoDB connected to ${mongoURI.includes("127.0.0.1") ? "local DB" : "Atlas DB"}`))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ---------- API ROUTE ----------
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

// ---------- EXPORT FOR VERCEL ----------
module.exports = app;
module.exports.handler = serverless(app);

// ---------- OPTIONAL LOCAL TESTING ----------
if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
