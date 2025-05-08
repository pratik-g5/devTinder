const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: '{VALUE} is not supported type',
      },
      // validate(value) {
      //   if (!['male', 'female', 'other'].includes(value.toLowerCase())) {
      //     throw new Error('Invalid gender: ' + value.toLowerCase());
      //   }
      // },
    },
    about: {
      type: String,
      default: 'This is a default about of the user!',
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, 'DEV@Tinder3105', {
    expiresIn: '1h',
  });
  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    userInputPassword,
    user.password
  );
  return isPasswordValid;
};

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
