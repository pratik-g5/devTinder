const express = require('express');

const connectDB = require('./config/database');

const app = express();

const port = 5000;

const User = require('./models/userModel');

app.use(express.json());

app.post('/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    res.status(200).send('user Saved successfully' + savedUser);
  } catch (error) {
    res.status(500).send('Error saving user ' + error.message);
  }
});

app.get('/user', async (req, res) => {
  const userEmail = req.body.email;
  console.log('userEmail', userEmail);
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
      'Gender',
      'phone',
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
