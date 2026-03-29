const validator = require('validator');

const validate = (data) => {
  const mandatoryFields = ['firstName', 'email', 'password'];

  const isAllowed = mandatoryFields.every((k) => Object.keys(data).includes(k));

  if (!isAllowed) {
    throw new Error('Missing mandatory fields');
  }

  if (!validator.isEmail(data.email)) {
    throw new Error('Invalid email');
  }

  if (!validator.isStrongPassword(data.password)) {
    throw new Error('weak password');
  }

  if (data.firstName.length < 3 || data.firstName.length > 20) {
    throw new Error('Invalid first name');
  }
};

module.exports = validate;