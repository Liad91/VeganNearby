const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const findOrCreate = require('../middlewares/user').findOrCreate;
const config = require('../../config');

const router = express.Router();

const callbackOprtions = {
  session: false,
  failureRedirect: `${config.clientUrl}/callback?err="failure"`
};

router.post('/jwt', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  const newToken = buildToken(user._id);

  user.password = '';
  res.status(200).json({
    token: newToken,
    user: user
  });
});

router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback', passport.authenticate('facebook', callbackOprtions), findOrCreate);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', callbackOprtions), findOrCreate);

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', passport.authenticate('twitter', callbackOprtions), findOrCreate);

function buildToken(userId) {
  return `JWT ${jwt.sign({ userId }, config.secret, { expiresIn: '2h' })}`;
}

module.exports = router;