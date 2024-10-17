require('dotenv').config();
require("./config/connection");

const { connect, disconnect } = require('./config/connection');
const { syncModels } = require('./models'); // Correctly import the models index

(async () => {
  await connect(); 
  await syncModels(); 
  // await disconnect(); 
})();


const PORT = process.env.PORT;
const express = require("express");
const app = express();
const cors = require('cors');

const multer = require('multer');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Routes Require
const register = require("./routes/userRegistration");
const product = require("./routes/product");

// Serve static route for files and images
app.use("/upload", express.static("upload"));

// Log of APIs request
const userRegistration = require("./controller/userRegistration");
app.use(userRegistration.logRequests);

// Routes Api
app.use("/api", register);
app.use("/api", product);

// Export the app for testing
module.exports = app;

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
}
