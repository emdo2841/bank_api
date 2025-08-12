const express = require("express");
const accountRouter = express.Router();
const { createAccount, getAccount, login } = require("../controller/account");
const { upload } = require("../utilities/cloudinary");

accountRouter.post("/create", upload.single("image"), createAccount);
accountRouter.get("/", getAccount);
accountRouter.post("/login", login);

module.exports = accountRouter;
