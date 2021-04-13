const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw new Error("User exists already.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = new User({
      discordName: req.body.discordName,
      email: req.body.email,
      password: hashedPassword,
    });

    const result = await user.save();

    res.json({ ...result._doc, password: null });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const checkuser = await User.findOne({ email: req.body.email });
    if (!checkuser) {
      throw new Error("User doesn't exists.");
    }

    const isEqual = await bcrypt.compare(req.body.password, checkuser.password);
    if (!isEqual) {
      throw new Error("Password is incorrect");
    }

    const token = jwt.sign(
      {
        userID: checkuser.id,
        email: checkuser.email,
        discordName: checkuser.discordName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      userID: checkuser.id,
      discordName: checkuser.discordName,
      token: token,
      tokenExpiration: 1,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
