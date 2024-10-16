const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const Product = require("../models/product");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


module.exports.addProduct = async (req, res) => {
  try {
    const { _id } = req.user;
    const { title, description, price, rating, stock, brand, category, images } = req.body;
    let errorMessage = '';

    // console.log(req.body, "req.body");

    if (!title) {
      errorMessage += 'Invalid title. ';
    }

    if (!description || typeof description !== 'string') {
      errorMessage += 'Invalid description. ';
    }

    if (!price || typeof price !== 'string') {
      errorMessage += 'Invalid price. ';
    }

    if (!rating || typeof rating !== 'string') {
      errorMessage += 'Invalid rating. ';
    }

    if (!stock || typeof stock !== 'string') {
      errorMessage += 'Invalid stock. ';
    }

    if (!brand || typeof brand !== 'string') {
      errorMessage += 'Invalid brand. ';
    }

    if (!category || typeof category !== 'string') {
      errorMessage += 'Invalid category. ';
    }

    // console.log(req.files, "req.files");
    const product = new Product({
      title,
      description,
      price,
      rating,
      stock,
      brand,
      category,
      images,
      createdBy: _id
    });
    if (req.files && req.files.images) {
      const files = req.files.images;
      const uploadedFiles = [];

      files.forEach((file) => {
        const ext = path.extname(file.originalname);
        const uniqueName = uuidv4();
        const filePath = `upload/${uniqueName}${ext}`;

        fs.renameSync(file.path, filePath);
        uploadedFiles.push(filePath);
      });

      // Add the uploaded file paths to the product object
      product.images = uploadedFiles;
    }

    if (errorMessage !== '') {
      return res.status(400).json({ error: errorMessage.trim() });
    }


    // console.log(product,"product");
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.log(err, "err");
    res.status(400).json({ error: err.message });
  }
}


module.exports.getProducts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const skip = (pageNumber - 1) * limitNumber;

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limitNumber);

    const products = await Product.find()
      .skip(skip)
      .limit(limitNumber);

    if (products.length == 0) {
      res.status(400).json({ message: "Not have enough product" })
    }
    res.status(200).json({
      products,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getOneProduct = async (req, res) => {
  try {
    const productId=req.params.id;

    const products = await Product.find({_id:productId})

    if(products.length == 0){
      res.status(500).json({ error: 'No product found for Id '+productId });
    }
    res.status(200).json({
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports.updateProduct = async (req, res) => {
  try {
    const { _id } = req.user;
    const productId = req.params.id;
    console.log(req.body, "req.body");
    const { title, description, price, rating, stock, brand, category, images } = req.body;
    console.log(title, "title");
    let errorMessage = '';

    if (!productId) {
      errorMessage += 'Invalid product ID. ';
    }

    if (errorMessage !== '') {
      return res.status(400).json({ error: errorMessage.trim() });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          title,
          description,
          price,
          rating,
          stock,
          brand,
          category,
          images,
        },
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Handle image upload
    if (images && req.files && req.files.images) {
      const files = req.files.images;
      const uploadedFiles = [];

      files.forEach((file) => {
        const ext = path.extname(file.originalname);
        const uniqueName = uuidv4();
        const filePath = `upload/${uniqueName}${ext}`;

        fs.renameSync(file.path, filePath);
        uploadedFiles.push(filePath);
      });

      // Delete previous images if any
      if (product.images && product.images.length > 0) {
        product.images.forEach((imagePath) => {
          fs.unlinkSync(imagePath);
        });
      }

      // Add the uploaded file paths to the product object
      product.images = uploadedFiles;
    }

    await product.save();

    res.status(200).json({
      status: 200,
      message: 'Product details updated successfully',
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};



module.exports.deleteProduct = async (req, res) => {
  try {
    const { _id } = req.user;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the associated images
    // if (product.images && product.images.length > 0) {
    //   product.images.forEach((imagePath) => {
    //     const fullPath = path.join(__dirname, '..', imagePath);
    //     fs.unlinkSync(fullPath);
    //   });
    // }

    const deleteProduct = await Product.findByIdAndDelete({ _id: productId });

    try {
      const foldername = path.join(process.cwd(), 'upload/');
    
      for (const imagePath of deleteProduct.images) {
        const fileName = imagePath.split('upload/')[1];
        console.log(fileName, 'fileName');
    
        if (!fileName) {
          console.log('Invalid file name.');
          continue;
        }

        const filePath = path.join(foldername, fileName);
    
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log('Something went wrong: ' + err);
            return err;
          } else {
            console.log('Deleted image: ' + fileName);
          }
        });
      }
    } catch (e) {
      console.log('Error in image deletion: ' + e);
    }
    



    res.status(200).json({
      status: 200,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
