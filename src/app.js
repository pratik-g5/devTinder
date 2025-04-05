const express = require('express');

const app = express();

const { adminAuth, userAuth } = require('./middlewares/auth');

const port = 5000;

app.use('/admin', adminAuth);

app.get('/admin/getAllData', (req, res) => {
  console.log('getData route called');
  res.send('Admin data');
});

app.get('/admin/deleteUser', (req, res) => {
  console.log('deleteUser route called');
  res.send('Deleted Sucessfully');
});

app.get('/user/login', (req, res) => {
  console.log('login route called');
  res.send('User logged in');
});

app.use('/user', userAuth);

app.get('/user/getData', (req, res) => {
  console.log('getData route called');
  res.send('User data sent');
});

app.listen(port, () => {
  console.log('Server is running at port 5000');
});
