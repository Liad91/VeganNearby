const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('../../api/middlewares/passport');

const app = express();
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = (db) => {
  /** Serve static files */
  app.use(express.static(path.join(__dirname, '..', '..', 'public')));

  /** Parse incoming requests */
  app.use(bodyParser.json({ limit: '1mb' }));

  /** Initialize Passport */
  passport(app);

  /** Load configurations for current environment */
  require(`./${environment}`)(app);

  /** Catch 404 */
  app.use((req, res, next) => {
    const err = new Error('Not found');
    err.type = 'not-found';
    err.status = 404;
    next(err);
  });

  /** Error handler */
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      type: err.type || 'server',
      message: err.message
    });
  });

  return app;
}
