const auth = require('./auth');
const users = require('./users');
const yelp = require('./yelp');

module.exports = (app) => {
  app.use('/auth', auth);
  app.use('/users', users);
  app.use('/yelp', yelp);
}
