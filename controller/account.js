const Account = require("../models/account");
const TokenStore = require("../models/tokenStore");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary } = require("../utilities/cloudinary");
require("dotenv").config();
const { generateToken, generateRefreshToken } = require("../utilities/jwt"); 

exports.createAccount = async (req, res) => {
  try {
    const imageUrl = req.file ? await uploadToCloudinary(req.file.path) : null;
    const {
      name,
      email,  
      gender,
      dob,
      occupation,
      country,
      city,
      nextOfKin_name,
      nextOfKin_email,
      nextOfKin_phone,
      nextOfKin_relationship,
      password,
      phone,
      address,
    } = req.body;

    // // 1. Check password match
    // if (password !== repeat_password) {
    //   return res.status(400).json({ message: "Passwords do not match" });
    // }
    const existingUser = await Account.findOne({ email });

      if (existingUser) {
        return res
          .status(409)
          .json({
            success: false,
            message: "Email already exists",
          });
      }

      const existingPhone = await Account.findOne({ phone });

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "phone Number already exists",
        });
      }
    // 2. Create account
    const account = await Account.create({
      name,
      email,
      image: imageUrl,
      gender,
      dob,
      occupation,
      country,
      city,
      nextOfKin_name,
      nextOfKin_email,
      nextOfKin_phone,
      nextOfKin_relationship,
      password,
      phone,
      address,
    });

    // 3. Create JWT token
    const token = jwt.sign(
      { id: account._id, account_number: account.account_number },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Store token in DB
    await TokenStore.create({
      token,
      user: account._id,
    });

    // 5. Respond
    res.status(201).json({
      message: "Account created successfully",
      success: true,
      account: {
        name: account.name,
        account_number: account.account_number,
        email: account.email,
        balance: account.balance,
      },
      token,
      data: account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAccount = async (req, res) => { 
  try {
    const account = await Account.find({})
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    console.log(account);
    res.status(200).json({
      success: true,
      message: "Account retrieved successfully",
      data: account
    });
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
exports.login = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { account_number, password } = req.body || {};
     console.log("Request body:", req.body);

    if (!account_number || !password) {
      return res
        .status(400)
        .json({ message: "account_number and password are required" });
    }

    const account = await Account.findOne({ account_number });
    if (!account) {
      return res
        .status(401)
        .json({ message: "Invalid account_number or password" });
    }

    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid account_number or password" });
    }

    const accessToken = generateToken(account);
    const refreshToken = generateRefreshToken(account);
    await TokenStore.create({ token: refreshToken, account: account._id });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      account: {
        _id: account._id,
        name: account.name, // not fullName unless you have it
        phone: account.phone,
        account_number: account.account_number,
        role: account.role,
        image: account.image,
        balance: account.balance,
        email: account.email,
        address: account.address,
      },
    });
    console.log(accessToken, refreshToken);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.log(error);
  }
};
// Client must send the refresh token
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required for logout" });
    }

    const deleted = await TokenStore.findOneAndDelete({ token: refreshToken });

    if (!deleted) {
      return res.status(404).json({ message: "Token not found or already logged out" });
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.update_account = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.path);
      updateData.image = imageUrl;
    }

    const account = await Account.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: false, // don't re-validate all required fields
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({
      message: "Account updated successfully",
      data: account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.delete_account = async (req, res) => {
  try {
    const  id  = req.params.id || req.user.id; // Use req.user.id if available, otherwise use id from params
    const account = await Account.findByIdAndDelete(id);
    
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    

    res.status(200).json({
      message: "Account deleted successfully",
      data: account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};