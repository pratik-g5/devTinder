const express = require('express');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('./models/userModel');
const { validateSignupData } = require('./utils/validation');

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, 'DEV@Tinder3105');
      res.cookie('token', token);
      res.send('Login successful!');
    } else {
      throw new Error('Invalid Credentials!');
    }
  } catch (error) {
    res.status(500).send('ERROR : ' + error.message);
  }
});

app.get('/profile', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error('Unauthorized!');
    }
    const decoded = jwt.verify(token, 'DEV@Tinder3105');
    const userId = decoded._id;
    const user = await User.findOne({ _id: userId });
    res.send(user);
  } catch (error) {
    return res.status(401).send('ERROR : ' + error.message);
  }
});

app.get('/user', async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.find({ email: userEmail });
    res.send(users);
  } catch (error) {
    res.status(500).send('Error fetching users ' + error.message);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send('Error fetching users ' + error.message);
  }
});

app.patch('/user', async (req, res) => {
  const data = req.body;
  const userId = req.body.userId;
  try {
    const ALLOWED_UPDATES = [
      'userId',
      'firstName',
      'lastName',
      'gender',
      'skills',
      'about',
      'age',
    ];
    const isUpdateAllowed = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (!isUpdateAllowed) {
      return res.status(400).send('Update not allowed!');
    }
    await User.findOneAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send('User updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send('User deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting user ' + error.message);
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
