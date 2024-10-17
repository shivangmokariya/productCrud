const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connection'); // Adjust the path as needed

const Product = sequelize.define('Product', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON, // Store file paths as JSON
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  }
});

const syncModels = async () => {
  await Product.sync();
  console.log('Product table created or updated');
};


module.exports = {Product,syncModels};