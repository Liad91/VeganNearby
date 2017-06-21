const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
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

UserSchema.method('comparePassword', function(password) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password)
      .then(isMatch => {
        resolve(isMatch);
      })
      .catch(err => reject(err));
  });
});

module.exports = mongoose.model('User', UserSchema);