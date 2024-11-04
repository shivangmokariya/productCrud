require('dotenv').config()
const { connect } = require("../config/connection");
const express = require("express");
const app = express();
const cors = require('cors');

const multer = require('multer');
const path = require('path');

const nodemailer=require("nodemailer");
const router=express.Router();
const authentication=require("../middleware/middleware")

let registration;
registration = require("../controller/userRegistration");


app.use(express.json());
app.use(cors());


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where uploaded files should be stored
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    // Specify the filename for the uploaded file
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
var cpUpload_post = upload.fields([
  { name: "profile_pic", maxCount: 1 }
]);
// console.log(registration.registration,"registration");
router.post("/registration",registration.userRegistration);
router.post("/login",registration.login);
router.put("/update-profile",authentication,registration.updateProfile);
router.get("/profile",authentication,registration.getProfileById);



module.exports=router;