const validator = require('validator');

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error('All fields are required!');
  } else if (!validator.isEmail(email)) {
    throw new Error('Invalid email format!');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Enter a strong password.');
  }
};

const validateProfileData = (req) => {
  const ALLOWED_UPDATE_FIELDS = [
    'firstName',
    'lastName',
    'age',
    'gender',
    'about',
    'skills',
  ];

  const isEditAllowed = Object.keys(req.body).every((key) =>
    ALLOWED_UPDATE_FIELDS.includes(key)
  );

  return isEditAllowed;
};

const validatePasswordUpdateData = (req) => {
  const { existingPassword, newPassword, repeatNewPassword } = req.body;

  const ALLOWED_FIELDS = [
    'existingPassword',
    'newPassword',
    'repeatNewPassword',
  ];

  const isUpdateAllowed = Object.keys(req.body).every((key) =>
    ALLOWED_FIELDS.includes(key)
  );

  if (!isUpdateAllowed) {
    throw new Error('Edit Not allowed');
  } else if (!newPassword || !repeatNewPassword || !existingPassword) {
    throw new Error('All fields are required!');
  } else if (
    existingPassword === newPassword ||
    newPassword.includes(existingPassword)
  ) {
    throw new Error('Try a new password!');
  } else if (newPassword !== repeatNewPassword) {
    throw new Error('New Password and Repeat New Password should be same!');
  } else if (!validator.isStrongPassword(newPassword)) {
    throw new Error('Enter a strong password.');
  }
};

module.exports = {
  validateSignupData,
  validateProfileData,
  validatePasswordUpdateData,
};
