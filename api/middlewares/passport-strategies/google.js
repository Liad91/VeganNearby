const Strategy = require('passport-google-oauth').OAuth2Strategy;
const google = require('../../../config').google;

const options = {
  clientID: google.clientID,
  clientSecret: google.clientSecret,
  callbackURL: google.callbackURL
}

const strategy = new Strategy(options, verify);

function verify(accessToken, refreshToken, profile, done) {
  const user = {
    username: profile.displayName,
    email: profile.emails[0].value,
    password: profile.id,    
    avatarUrl: profile.photos[0].value
  };

  return done(null, user);
}

module.exports = strategy;
