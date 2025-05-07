const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error('Unauthenticated user!');
    }
    const decodedObj = jwt.verify(token, 'DEV@Tinder3105');

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User not found!');
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send('ERROR : ' + err.message);
  }
};

module.exports = { userAuth };
