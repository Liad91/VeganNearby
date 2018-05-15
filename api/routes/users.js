const fs = require('fs');
const path = require('path');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Jimp = require("jimp");
const User = require('../models/user');
const config = require('../../config');
const upload = require('../middlewares/multer').single('avatar');

const router = express.Router();

/** Register */
router.post('/register', (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      err.type = 'upload';
      err.message = 'File upload failed. please try a different one';
      return next(err);
    }

    if (!req.body.email || !req.body.password || !req.body.name) {
      const err = new Error('All fields are required!');

      err.status = 403;
      err.type = 'required';
      return next(err);
    }

    User.create(req.body)
      .then(user => {
        if (req.file) {
          const timestamp = Date.now();

          return Promise.all([
            setImageFile(user._id, timestamp, req.file),
            user.setAvatar(`${req.protocol}://${req.get('host')}/images/users/${user._id}-${timestamp}.${req.file.type}`)
          ]);
        }
        return user;
      })
      .then(val => {
        user = Array.isArray(val) ? val[1] : val;
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

/** Login */
router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
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

/** Update */
router.post('/update', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      err.type = 'upload';
      err.message = 'File upload failed. please try a different one';
      return next(err);
    }

    const { email, name, image } = req.body;

    if (!email || !name) {
      const err = new Error('All fields are required!');

      err.status = 403;
      err.type = 'required';
      return next(err);
    }

    req.user.email = email;
    req.user.name = name;

    req.user.save()
      .then(user => {
        if (req.file) {
          const timestamp = Date.now();

          if (user.avatarUrl) {
            removeImageFile(user);
          }

          return Promise.all([
            setImageFile(user._id, timestamp, req.file),
            user.setAvatar(`${req.protocol}://${req.get('host')}/images/users/${user._id}-${timestamp}.${req.file.type}`)
          ]);
        }
        else {
          if (user.avatarUrl && !image) {
            removeImageFile(user);
            return user.setAvatar(null);
          }
          return user;
        }
      })
      .then(val => {
        user = Array.isArray(val) ? val[1] : val;
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

/** Update user background */
router.put('/background', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  const token = buildToken(user._id);

  user.setBackground(req.body.index)
    .then(() => res.status(200).json({
      token
    }))
    .catch(() => res.status(403).end());
});

/** Add to favorites */
router.put('/favorites/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  const token = buildToken(user._id);

  user.addToFavorites(req.body.id)
    .then(() => res.status(200).json({
      token
    }))
    .catch(() => res.status(403).end());
});

/** Remove from favorites */
router.put('/favorites/remove', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  const token = buildToken(user._id);

  user.removeFromFavorites(req.body.id)
    .then(() => res.status(200).json({
      toke,
      id: req.body.id
    }))
    .catch(() => res.status(403).end());
});

/** Authentication */
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
  return `JWT ${jwt.sign({ userId }, config.secret, { expiresIn: '2h' })}`;
}

function setImageFile(id, timestamp, file) {
  return new Promise((resolve, reject) => {
    const newFilePath = `public/images/users/${id}-${timestamp}.${file.type}`;

    /** Move the image from ./public/temp to ./public/images/users */
    fs.renameSync(file.path, newFilePath);

    /** Rezise the image */
    Jimp.read(newFilePath, function (err, image) {
      if (err) {
        reject(err);
      }
      image.resize(200, 200).quality(80).write(newFilePath);
      resolve();
    });
  });
}

function removeImageFile(user) {
  const oldFilePath = `public/images/users/${path.parse(user.avatarUrl).base}`;

  /** Remove the old image */
  if (fs.existsSync(path.resolve(__dirname, '../..', oldFilePath))) {
    fs.unlinkSync(oldFilePath);
  }
}

module.exports = router;
