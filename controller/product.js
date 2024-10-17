const {Product} = require("../models");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

module.exports.addProduct = async (req, res) => {
  try {
    const { id } = req.user;
    const { title, description, price, rating, stock, brand, category, images } = req.body;
    let errorMessage = '';
    if (!title) errorMessage += 'Invalid title. ';
    if (!description || typeof description !== 'string') errorMessage += 'Invalid description. ';
    if (!price || typeof price !== 'string') errorMessage += 'Invalid price. ';
    if (!rating || typeof rating !== 'string') errorMessage += 'Invalid rating. ';
    if (!stock || typeof stock !== 'string') errorMessage += 'Invalid stock. ';
    if (!brand || typeof brand !== 'string') errorMessage += 'Invalid brand. ';
    if (!category || typeof category !== 'string') errorMessage += 'Invalid category. ';

    if (errorMessage !== '') {
      return res.status(400).json({ error: errorMessage.trim() });
    }

    const product = await Product.create({
      title,
      description,
      price,
      rating,
      stock,
      brand,
      category,
      createdBy: id,
      images: []
    });

    // if (req.files && req.files.images) {
    //   const files = req.files.images;
    //   const uploadedFiles = [];

    //   files.forEach((file) => {
    //     const ext = path.extname(file.originalname);
    //     const uniqueName = uuidv4();
    //     const filePath = `upload/${uniqueName}${ext}`;

    //     fs.renameSync(file.path, filePath);
    //     uploadedFiles.push(filePath);
    //   });

    //   product.images = uploadedFiles;
    //   await product.save();
    // }

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.getProducts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const { count, rows } = await Product.findAndCountAll({
      limit: limitNumber,
      offset: (pageNumber - 1) * limitNumber,
    });

    res.status(200).json({
      products: rows,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
      totalProducts: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getOneProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: 'No product found for Id ' + productId });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { _id } = req.user;
    const productId = req.params.id;
    const { title, description, price, rating, stock, brand, category, images } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    Object.assign(product, {
      title,
      description,
      price,
      rating,
      stock,
      brand,
      category,
      images: images || product.images,
    });

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

      if (product.images && product.images.length > 0) {
        product.images.forEach((imagePath) => {
          fs.unlinkSync(imagePath);
        });
      }

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
    const productId = req.params.id;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }


    if (product.images && product.images.length > 0) {
      product.images.forEach((imagePath) => {
        try {
          fs.unlinkSync(imagePath); // Attempt to delete the file
        } catch (err) {
          // Ignore the error if the file does not exist
          if (err.code !== 'ENOENT') {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        }
      });
    }

    await Product.destroy({ where: { id: productId } });

    res.status(200).json({
      status: 200, //  
      message: 'Product deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
