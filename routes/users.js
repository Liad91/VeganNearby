const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Jimp = require("jimp");
const router = express.Router();

const User = require('../models/user');
const config = require('../config/database');
const upload = require('../config/multer').single('avatar');

function buildToken(userId) {
  return `JWT ${jwt.sign({ userId }, config.secret, { expiresIn: '2h' })}`;
}

// Signup
router.post('/signup',(req, res, next) => {
  upload(req, res, err => {
    if (err) {
      err.type = 'upload';
      err.message = 'File upload failed. please try a different one';
      return next(err);
    }

    User.create(req.body)
      .then(user => {
        if (req.file) {
          const newFilePath = `public/images/users/${user._id}.${req.file.type}`;

           /** Move the image from ./public/temp to ./public/images/users */
          fs.renameSync(req.file.path, newFilePath);

          /** Rezise the image */
          Jimp.read(newFilePath, function(err, image) {
            if (err) {
              return;
            }
            image.resize(200, 200).quality(80).write(newFilePath);
          });
          return user.setAvatar(`${req.protocol}://${req.get('host')}/images/users/${user._id}.${req.file.type}`);
        }
      })
      .then(() => {
        res.status(201).json({});        
      })
      .catch(err => {
        /** Remove the image */
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        next(err);
      });
  });
});

// Signin
router.post('/signin', (req, res, next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        const err = new Error('Authentication failed');
        err.status = 401;
        err.type = 'authentication';
        next(err);
      }
      else {
        user.comparePassword(req.body.password)
          .then(isMatch => {
            if (!isMatch) {
              const err = new Error('Authentication failed');
              err.status = 401;
              err.type = 'authentication';
              next(err);
            }
            else {
              const token = buildToken(user.id);

              res.status(200).json({
                token: token,
                user: {
                  id: user.id,
                  email: user.email,
                  username: user.username,
                  avatarUrl: user.avatarUrl
                }
              });
            }
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

// Authentication
router.post('/authenticate', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  const newToken = buildToken(user._id);

  res.status(200).json({
    token: newToken,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl
    }
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.status(200).end();
});

module.exports = router;