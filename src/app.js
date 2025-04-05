const express = require('express');

const app = express();

const port = 5000;

app.use(
  '/hello/2',
  (req, res, next) => {
    console.log('Router 1');
    // res.send('Hello world 2 !');
    next();
  },
  (req, res) => {
    console.log('Router 2');
    res.send('Hello world !');
  }
);

app.use('/test', (req, res, next) => {
  res.send('Test Page');
});

app.use('/', (req, res) => {
  res.send('This is a homepage !');
});

app.listen(port, () => {
  console.log('Server is running at port 5000');
});
