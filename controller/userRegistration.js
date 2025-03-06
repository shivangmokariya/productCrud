const jwt = require("jsonwebtoken");
const express = require("express");
const argon2 = require("argon2");
const User = require("../models/userRegistration");

// Log API requests
module.exports.logRequests = (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
};

// User Registration
module.exports.userRegistration = async (req, res) => {
  try {
    let { email, name, password } = req.body;
    const useremail = await User.findOne({ email });
    
    if (useremail) {
      return res.send({
        status: 100,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await argon2.hash(password); // Hashing password with Argon2

    const user = new User({ email, name, password: hashedPassword });

    await user.save();

    res.status(200).send({
      message: "User registered successfully",
      status: 200,
      data: user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      status: 500,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// User Login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
        status: 400,
        error: "Login details are invalid",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({
        message: "User not registered",
        status: 400,
        error: "Login details are invalid",
      });
    }

    // Check if the user signed up using Google
    if (user.googleId && !user.password) {
      return res.status(200).send({
        message: "It looks like you signed up with Google. Set a password to log in with email.",
        status: 204,
      });
    }

    const isPasswordValid = await argon2.verify(user.password, password); // Verify password

    if (!isPasswordValid) {
      return res.status(400).send({
        message: "Invalid login details",
        status: 400,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).send({
      message: "User logged in successfully",
      status: 200,
      data: user,
      token: token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: "An error occurred while logging in",
      status: 500,
      error: e.message,
    });
  }
};


module.exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const { _id } = req.user;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).send({
        message: "Email, First Name, and Last Name are required.",
        status: 400,
      });
    }

    // Find the user by email
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send({
        message: "User not found.",
        status: 404,
      });
    }

    // Update the user's profile details
    user.name =` ${firstName} ${lastName}`;

    // Save the updated user details
    await user.save();

    res.status(200).send({
      message: "Profile updated successfully",
      status: 200,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "An error occurred while updating the profile.",
      status: 500,
      error: error.message,
    });
  }
};

module.exports.getProfileById = async (req, res) => {
  try {
    const { _id } = req.user;

    // Find the user by userId
    const user = await User.findById(_id);

    // Check if the user exists
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        status: 404,
      });
    }

    // Send user data if found
    res.status(200).send({
      message: "User profile fetched successfully",
      status: 200,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "An error occurred while fetching the user profile",
      status: 500,
      error: error.message,
    });
  }
};


// Check User
module.exports.checkUser = async (decoded, result) => {
  const userData = await User.findById(decoded.userId);
  result(null, userData);
};
