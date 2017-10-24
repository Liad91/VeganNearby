const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Jimp = require("jimp");
const router = express.Router();

const User = require('../models/user');
const jwtSecret = require('../config/credentials').jwtSecret;
const upload = require('../middlewares/multer').single('avatar');

// Register
router.post('/register',(req, res, next) => {
  upload(req, res, err => {
    if (err) {
      err.type = 'upload';
      err.message = 'File upload failed. please try a different one';
      return next(err);
    }

    if (!req.body.email || !req.body.password || !req.body.username) {
      const err = new Error('All fields are required!');

      err.status = 403;
      err.type = 'required';
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
        return user;
      })
      .then(user => {
        user.password = ''
        res.status(201).json({
          token: buildToken(user.id),
          user
        });        
      })
      .catch(err => {
        /** Remove the image */
        if (req.file) {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        }
        if (err.name === 'ValidationError') {
          const error = {
            status: 400,
            type: 'validation',
            message: {}
          };
          
          for (const field in err.errors) {
            if (field == 'email' && err.errors.email.message === 'Unique') {
              error.message.email = 'unique';
              continue;
            }
            error.message[field] = 'validation';
          }
          return next(error);
        }
        next(err);
      });
  });
});

// Login
router.post('/login', (req, res, next) => {
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
              user.password = '';
              res.status(200).json({
                token: buildToken(user.id),
                user
              });
            }
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

// Update user background
router.put('/background', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  const token = buildToken(user._id);

  user.setBackground(req.body.index)
    .then(() => res.status(200).json({
      token
    }))
    .catch(() => res.status(403).end());
});

// Add to favorites
router.put('/favorites/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  const token = buildToken(user._id);

  user.addToFavorites(req.body.id)
    .then(() => res.status(200).json({
      token
    }))
    .catch(() => res.status(403).end());
});

// Remove from favorites
router.put('/favorites/remove', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  const token = buildToken(user._id);
  
  user.removeFromFavorites(req.body.id)
    .then(() => res.status(200).json({
      token
    }))
    .catch(() => res.status(403).end());
});

// Authentication
router.post('/authenticate', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  const newToken = buildToken(user._id);

  user.password = '';
  res.status(200).json({
    token: newToken,
    user: user
  });
});

function buildToken(userId) {
  return `JWT ${jwt.sign({ userId }, jwtSecret, { expiresIn: '2h' })}`;
}

module.exports = router;
