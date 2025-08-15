const express = require("express");
const accountRouter = express.Router();
const { createAccount, getAccount, login, logout } = require("../controller/account");
const { upload } = require("../utilities/cloudinary");

accountRouter.post("/create", upload.single("image"), createAccount);
accountRouter.get("/", getAccount);
accountRouter.post("/login", login);
accountRouter.post("/logout", logout);

module.exports = accountRouter;
