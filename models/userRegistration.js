const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const User = sequelize.define('Auth', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email is already in use.',
    },
    validate: {
      isEmail: {
        msg: 'Please enter a valid email address.',
      },
      notEmpty: {
        msg: 'Email is required.',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password is required.',
      },
    },
  },
});


const syncModels = async () => {
  await User.sync();
  console.log('Auth table created or updated');
};

module.exports = {
  User,
  syncModels,
};
