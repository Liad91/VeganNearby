const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');
const config = require('../config/database');

// Register
router.post('/register', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      res.status(201).json({
        success: true,
        message: 'User registered'
      });
    })
    .catch(err => next(err));
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  User.findOne({username: req.body.username})
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
              const token = jwt.sign({ userId: user.id }, config.secret, { expiresIn: '2h' });

              res.status(200).json({
                success: true,
                token: `JWT ${token}`,
                user: {
                  id: user._id,
                  name: user.name,
                  username: user.username,
                  email: user.email
                }
              });
            }
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ success: true })
});

module.exports = router;