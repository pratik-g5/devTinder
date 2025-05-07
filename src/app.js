const express = require('express');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('./models/userModel');
const { validateSignupData } = require('./utils/validation');
const { userAuth } = require('./middlewares/auth');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
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
      res.send('Login successful!');
    } else {
      throw new Error('Invalid Credentials!');
    }
  } catch (error) {
    res.status(500).send('ERROR : ' + error.message);
  }
});

app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send('ERROR : ' + error.message);
  }
});

connectDB()
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });

app.listen(port, () => {
  console.log('Server is running at port 5000');
});
