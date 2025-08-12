const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Counter schema for auto-increment
const CounterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 2121431100 },
});
const Counter = mongoose.model("Counter", CounterSchema);

const AccountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    gender: { type: String, required: true },
    dob: { type: Date},
    occupation: { type: String},
    country: { type: String, required: true },
    city: { type: String, required: true },
    nextOfKin_name: { type: String, required: true },
    nextOfKin_email: { type: String, required: true, unique: true },
    nextOfKin_phone: { type: String, required: true, unique: true },
    nextOfKin_relationship: { type: String, required: true },
    account_number: { type: Number, unique: true },
    password: { type: String, required: true },
    repeat_password: { type: String, required: true },
    pin: { type: String, required: true },
    account_currency: { type: String, enum: ["US Dollar", "Euro", "Pounds Sterling", "Canadian", "Autralian Dollar", ], default: "US Dollar" },
    balance: { type: Number, default: 0 },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    image: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-increment account_number before saving
AccountSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "account_number" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // If counter was just created, use initial value
    if (counter.seq === 2121431101 && (await Account.countDocuments()) === 0) {
      this.account_number = 2121431100;
      // Reset the counter back to base so next time will be +1
      await Counter.updateOne({ id: "account_number" }, { seq: 2121431100 });
    } else {
      this.account_number = counter.seq;
    }
  }

  // Hash password if modified
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
AccountSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Account = mongoose.model("Account", AccountSchema);
module.exports = Account;
