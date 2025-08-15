const express = require("express");
const accountRouter = express.Router();
const { createAccount, getAccount, login, logout, update_account, delete_account } = require("../controller/account");
const { upload } = require("../utilities/cloudinary");
const {protect, authorize} = require("../middleware/auth");

accountRouter.post("/create", upload.single("image"), createAccount);
accountRouter.get("/",  getAccount);
accountRouter.post("/login", login);
accountRouter.post("/logout", protect, logout);
accountRouter.patch("/update/:id", protect, upload.single("image"), update_account); //Assuming update uses the same logic as create
accountRouter.delete("/delete/:id", protect, authorize('admin'), delete_account); // Get the logged-in user's account

module.exports = accountRouter;
