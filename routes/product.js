const express = require("express");
const app = express();
const cors = require('cors');

const multer = require('multer');
const path = require('path');

const nodemailer=require("nodemailer");
const router=express.Router();
const authentication=require("../middleware/middleware")

let product;
product = require("../controller/product");


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
  { name: "images", maxCount: 10 }
]);


// console.log(registration.registration,"registration");
router.post("/addProduct",cpUpload_post,authentication,product.addProduct);
router.get("/getProduct",authentication,product.getProducts);
router.get("/getOneProduct/:id",authentication,product.getOneProduct);
router.put("/updateProduct/:id",cpUpload_post,authentication,product.updateProduct);
router.delete("/deleteProduct/:id",authentication,product.deleteProduct);



module.exports=router;