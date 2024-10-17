const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models"); // Adjust the import based on your structure

// Log of API requests
module.exports.logRequests = (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
};

module.exports.userRegistration = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Check if the user already exists
    const useremail = await User.findOne({ where: { email } });
    if (useremail) {
      return res.status(400).send({
        status: 100,
        message: "Email already exists."
      });
    } else {
      // Hash the password
      password = await bcrypt.hash(password, 10);
      
      // Create a new user
      const user = await User.create({ email, password });

      res.status(200).send({
        message: "User registered successfully",
        status: 200,
        data: user,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      status: 400,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send({ 
        message: "Email and Password are required",
        status: 400,
        error: "Login details are invalid"
      });
    }

    // Find the user
    const useremail = await User.findOne({ where: { email } });

    if (!useremail) {
      return res.status(400).send({
        message: "User not found",
        status: 400,
        error: "Login details are invalid"
      });
    }

    // Check the password
    const hPassword = await bcrypt.compare(password, useremail.password);
    if (!hPassword) {
      return res.status(400).send({
        message: "Invalid password",
        status: 400,
        error: "Login details are invalid"
      });
    }

    // Generate a token
    const token = jwt.sign({ userId: useremail.id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    res.status(200).send({
      message: "User logged in successfully",
      status: 200,
      data: useremail,
      token: token
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Login failed",
      status: 400,
      error: "Login details are invalid",
      errorDetail: e.message,
    });
  }
};

module.exports.checkUser = async (decoded, result) => {
  try {
    const userData = await User.findByPk(decoded.userId);
    console.log(userData,"<<<<<<<<userData");
    result(null, userData.dataValues);
  } catch (e) {
    result(e, null);
  }
};