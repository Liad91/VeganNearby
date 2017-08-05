const passport = require('passport');

const jwt = require('./jwt');
const facebook = require('./facebook');
const google = require('./google');
const twitter = require('./twitter');

function setStrategies() {
  passport.use(jwt);
  passport.use(facebook);
  passport.use(google);
  passport.use(twitter);
}

module.exports = setStrategies;
