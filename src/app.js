const express = require('express');

const app = express();

const port = 5000;

app.get('/', (req, res) => {
  res.send('This is a homepage !');
});

app.get('/test', (req, res) => {
  res.send('Hello world !');
});

app.listen(port, () => {
  console.log('Server is running at port 5000');
});
