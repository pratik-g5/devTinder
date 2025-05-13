const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/userModel');
const { validateSignupData } = require('../utils/validation');

authRouter.post('/signup', async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.status(200).send('User saved successfully' + savedUser);
  } catch (error) {
    res.status(500).send('ERROR : ' + error.message);
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format!');
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid Credentials!');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie('token', token);
      res.send(user);
    } else {
      throw new Error('Invalid Credentials!');
    }
  } catch (error) {
    res.status(500).send('ERROR : ' + error.message);
  }
});

authRouter.post('/logout', async (req, res) => {
  res.cookie('token', null, { expires: new Date(Date.now()) });
  res.send('Logout successful!');
});

module.exports = authRouter;
