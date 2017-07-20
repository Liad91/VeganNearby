const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const config = require('../config/database');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next) {
  const user = this;
  
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt)
      .then(hash => {
        user.password = hash;
        next();
      })
      .catch(err => next(err));
  });
});

userSchema.method('comparePassword', function(password) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password)
      .then(isMatch => {
        resolve(isMatch);
      })
      .catch(err => reject(err));
  });
});

userSchema.plugin(uniqueValidator, { message: 'Unique validation failed: {PATH}' });

module.exports = mongoose.model('User', userSchema);