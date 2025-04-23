const express = require('express');

const connectDB = require('./config/database');

const app = express();

const port = 5000;

const User = require('./models/userModel');

app.post('/signup', async (req, res) => {
  const userObj = {
    firstName: 'Akshay',
    lastName: 'Saini',
    email: 'akshay@gmail.com',
    password: 'akshay12',
    phone: '9876543210',
    gender: 'Male',
  };

  const user = new User(userObj);
  try {
    const savedUser = await user.save();
    res.status(200).send('user Saved successfully' + savedUser);
  } catch (error) {
    res.status(500).send('Error saving user ' + error.message);
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
