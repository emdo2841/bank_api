const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schama({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
})
const User = mongoose.model("User", userSchema);
module.exports = User; 