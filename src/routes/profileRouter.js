const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const {
  validateProfileData,
  validatePasswordUpdateData,
} = require('../utils/validation');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send('ERROR : ' + err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      res.send('Edit Not allowed');
    }
    const existingUserData = req.user;

    Object.keys(req.body).forEach((key) => {
      existingUserData[key] = req.body[key];
    });

    await existingUserData.save();

    res.json({
      message: 'Profile updated successfully!',
      user: existingUserData,
    });
  } catch (err) {
    res.status(401).send('ERROR : ' + err);
  }
});

profileRouter.post('/profile/password', userAuth, async (req, res) => {
  try {
    validatePasswordUpdateData(req);

    const isPasswordValid = await req.user.validatePassword(
      req.body.existingPassword
    ); //check if the existing password matches in the db

    if (!isPasswordValid) {
      throw new Error('Invalid existing Password');
    }
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

    await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { new: true }
    );

    const token = await req.user.getJWT();
    res.cookie('token', token).send('Password updated successfully!');
  } catch (err) {
    res.status(401).send('ERROR : ' + err.message);
  }
});

module.exports = profileRouter;
