const jwt = require('./jwt');
const facebook = require('./facebook');
const google = require('./google');
const twitter = require('./twitter');

module.exports = (passport) => {
  passport.use(jwt);
  passport.use(facebook);
  passport.use(google);
  passport.use(twitter);
}
