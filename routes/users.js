const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');
const config = require('../config/database');

function buildToken(userId) {
  return `JWT ${jwt.sign({ userId }, config.secret, { expiresIn: '15s' })}`;
}

// Register
router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      res.status(201).json({
        success: true
      });
    })
    .catch(err => next(err));
});

// Authenticate
router.post('/signin', (req, res, next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        const err = new Error('Authentication failed');
        err.status = 401;
        next(err);
      }
      else {
        user.comparePassword(req.body.password)
          .then(isMatch => {
            if (!isMatch) {
              const err = new Error('Authentication failed');
              err.status = 401;
              next(err);
            }
            else {
              const token = buildToken(user.id);

              res.status(200).json({
                success: true,
                token: token,
                user: {
                  id: user.id,
                  email: user.email,
                  username: user.username
                }
              });
            }
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

router.post('/authenticate', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  const newToken = buildToken(user._id);

  res.status(200).json({
    success: true,
    token: newToken,
    user: {
      id: user._id,
      email: user.email,
      username: user.username
    }
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ success: true })
});

module.exports = router;