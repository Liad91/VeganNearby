const Strategy = require('passport-facebook').Strategy;
const facebook = require('../../../config').facebook;

const options = {
  clientID: facebook.appId,
  clientSecret: facebook.appSecret,
  callbackURL: facebook.callbackURL,
  profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
}

const strategy = new Strategy(options, verify);

function verify(accessToken, refreshToken, profile, done) {
  const user = {
    username: profile.displayName,
    email: profile.emails[0].value,
    password: profile.id,    
    avatarUrl: profile.photos[0].value
  }

  return done(null, user);
}

module.exports = strategy;
