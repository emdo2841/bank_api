const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // Automatically delete after 7 days
});

const TokenStore = mongoose.model("TokenStore", tokenSchema);
module.exports = TokenStore;
