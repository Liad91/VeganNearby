const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = passport => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
  };

  passport.use(new JwtStrategy(options, (jwt_payload, done) => {
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
  }));
}