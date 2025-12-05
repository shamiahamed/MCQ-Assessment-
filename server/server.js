// api/result.js

const mongoose = require("mongoose");
const Result = require("../server/models/Result");
require("dotenv").config();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("✅ MongoDB connected");
}

export default async function handler(req, res) {
  // ✅ Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Only POST allowed" });
  }

  try {
    await connectDB();

    const result = new Result(req.body);
    await result.save();

    return res.status(200).json({ msg: "saved" });
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({ msg: "error saving result" });
  }
}
