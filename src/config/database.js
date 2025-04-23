const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://pgumthanavar05:CP3lw2KT5XTwFGtc@devtinder.f9kyf1o.mongodb.net/'
  );
};

module.exports = connectDB;
