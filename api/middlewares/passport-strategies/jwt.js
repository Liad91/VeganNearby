const Strategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../../models/user');
const config = require('../../../config');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.secret
};

const strategy = new Strategy(options, verify)

function verify(jwt_payload, done) {
  User.findById(jwt_payload.userId)
    .then(user => {
      if (!user) {
        const err = new Error('User not found');
        err.type = 'not-found';
        err.status = 404;
        done(err);
      }
      else {
        done(null, user);
      }
    })
    .catch(err => done(err));
}

module.exports = strategy;
