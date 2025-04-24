const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email: ' + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Invalid phone number'],
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!['male', 'female', 'other'].includes(value.toLowerCase())) {
          throw new Error('Invalid gender: ' + value.toLowerCase());
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
