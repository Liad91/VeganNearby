const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
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
  },
  avatarUrl: {
    type: String
  },
  favorites: [{
    type: String
  }]
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
    bcrypt.compare(password, user.password)
      .then(isMatch => resolve(isMatch))
      .catch(err => reject(err));
  });
});

userSchema.method('setAvatar', function(url) {  
  return this.update({avatarUrl: url});
});

userSchema.method('addToFavorites', function(id) {
  const user = this;

  return new Promise((resolve, reject) => {
    if (user.favorites.indexOf(id) > -1 || user.favorites.length >= 20) {
      return reject();
    }
    else {
      user.favorites.push(id);
      return resolve(user.save());
    }
  });
});

userSchema.method('removeFromFavorites', function(id) {
  const user = this;
  const index = user.favorites.findIndex(i => i === id);
  
  return new Promise((resolve, reject) => {
    if (index === -1) {
      return reject();
    }
    else {
      user.favorites.splice(index, 1);
      return resolve(user.save());
    }
  });
});

userSchema.static('findOrCreate', function(user) {
  const model = this;

  return new Promise((resolve, reject) => {
    model.findOne({email: user.email})
    .then(doc => {
      if (doc) {
        return resolve(doc);
      }
      return resolve(model.create(user));
    })
    .catch(err => reject(err));
  });
});

userSchema.plugin(uniqueValidator, { message: 'Unique' });

module.exports = mongoose.model('User', userSchema);