require('dotenv').config();
require("./config/connection");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const cors = require('cors');
const passport = require('passport')
const session = require('express-session')

//Middleware
app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))

app.use(passport.initialize()) // init passport on every route call
app.use(passport.session())    //allow passport to use "express-session"

const multer = require('multer');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Routes Require
const register = require("./routes/userRegistration");
const product = require("./routes/product");
const auth = require("./routes/auth");

// Serve static route for files and images
app.use("/upload", express.static("upload"));

// Log of APIs request
const userRegistration = require("./controller/userRegistration");
app.use(userRegistration.logRequests);

// Routes Api
app.use("/api", register);
app.use("/api", product);
app.use("/", auth);

// Export the app for testing
module.exports = app;

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
}
