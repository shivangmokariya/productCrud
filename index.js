require('dotenv').config()
const { connect } = require("./config/connection");
const PORT = process.env.PORT;
const express = require("express");
const app = express();
const cors = require('cors');

const multer = require('multer');
const path = require('path');
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Routes Require
const register=require("./routes/userRegistration")
const product=require("./routes/product")


//serve static route for files and images
app.use("/upload", express.static("upload"));

//log of APIs request
const userRegistration=require("./controller/userRegistration")
app.use(userRegistration.logRequests)


//Routes Api
app.use("/api",register);
app.use("/api",product);


app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
})