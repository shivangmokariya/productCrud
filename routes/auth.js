const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");
const User = require("../models/userRegistration");


// Google callback
router.post("/auth/google/callback", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ success: false, error: "Invalid Google token" });
    }
    // f64e42ab5498b5228cdd2cfbc5e1cf62ce58e659
    const { email, name, jti } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (user.name !== name) {
        user.name = name;
        await user.save();
      }else if(user.googleId !== jti){
        user.googleId = jti;
        await user.save();
      }
    } else {
      user = new User({ email, name, googleId:jti });
      await user.save();
    }

    // Generate JWT Token
    const jwtToken = jwt.sign({ userId:user?._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    res.json({ success: true, user, token: jwtToken });
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid Google token" });
  }
});

router.post('/api/validate-auth', (req, res) => {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized", message: "No token provided." });
  }

  const token = authorization.replace('Bearer ', '').replace('bearer ', '');

  try {
    jwt.verify(token, process.env.SECRET_KEY);
    return res.status(200).json({ success: true, message: "Token is valid." });
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid or expired token." });
  }
});




module.exports = router;
