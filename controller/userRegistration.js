const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userRegistration");


//log of APIs request
module.exports.logRequests = (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
};

module.exports.userRegistration = async (req, res) => {
  try {
   let {email, password}=req.body;
    const useremail = await User.findOne({ email });
    if (useremail) {
      res.send({
        status: 100,
        message: "Email already exists."
      })
    } else {
      // console.log(req.body);
      const user = new User(req.body);
      password = await bcrypt.hash(password, 10);

      user.password=password;
    

      await user.save();
      // console.log(user.password, "user");
      res.status(200).send({
        message: "user registerd successfully",
        status: 200,
        data: user,
      });
      // console.log(user);
    }

  } catch (e) {
    console.log(e);
    res.status(401).send({
      status: 400,
      message: "something Went wrong ", e
    });
  }
}


module.exports.login = async (req, res) => {
  try {
      const email = req.body.email;
      const password = req.body.password;
    if(!email || !password ){
      res.status(400).send({
        message: "Email And Password are required ",
        status: 400,
        error: "Login details are invalid"
      })
    }
    if (req.body.email) {
      // console.log(email);
      const useremail = await User.findOne({ email });
      // console.log(useremail, "useremail");
      const hPassword = await bcrypt.compare(password, useremail.password);

      const token = jwt.sign({ userId: useremail._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
      if (hPassword == true) {
        res.status(200).send({
          message: "user login successfully",
          status: 200,
          data: useremail,
          token: token
        });
      } else {
        res.status(400).send({
          message: "user not login ",
          status: 400,
          error: "Login details are invalid"
        })
      }
    }
  } catch (e) {
    res.status(400).send({
      message: "user not registered ",
      status: 400,
      error: "Login details are invalid",
    });
  }
}


module.exports.checkUser = async (decoded, result) => {
  const userData = await User.findById(decoded.userId);
  result(null, userData);
  return;
};
