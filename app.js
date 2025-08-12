const express = require("express")
const app = express()
require('dotenv').config();
const { connectToMongo } = require('./db');

const accountRouter = require("./router/account");
  
const fs = require("fs");
const PORT = process.env.PORT || 5000;
// const authenticateRoute = require("./Route/authentication");
// const { protect, authorize } = require("./middleware/auth");

// const isAuthenticated = require('./middleware/isAuthenticated');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
app.use(helmet());


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

connectToMongo().then(() => {
  console.log("MongoDB connected successfully");
});



app.use("/account", accountRouter);

app.get('/', (req, res) => {
    res.status(200).send("Welcome to the API");
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
