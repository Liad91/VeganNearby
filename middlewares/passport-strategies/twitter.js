const Strategy = require('passport-twitter').Strategy;
const twitter = require('../../config/credentials').twitter;

const options = {
  consumerKey: twitter.consumerKey,
  consumerSecret: twitter.consumerSecret,
  callbackURL: twitter.callbackURL,
  userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'
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
