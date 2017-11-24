const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('../api/routes');
const passport = require('../api/middlewares/passport');

const app = express();

module.exports = (db) => {
  /** Enable CORS - Cross Origin Resource Sharing */
  app.use(cors());

  /** Set static folder */
  app.use(express.static(path.join(__dirname, '..', 'dist')));

  /** Parse incoming requests */
  app.use(bodyParser.json({limit: '1mb'}));

  /** Set session */
  app.use(session({
    secret: 'long',
    resave: true,
    saveUninitialized: true
  }));

  /** Set morgan */
  /** Log only 4xx and 5xx responses to morgan.log */
  if (process.env.NODE_ENV) {
    app.use(morgan('common', {
      skip: (req, res) => res.statusCode < 400,
      stream: fs.createWriteStream(path.join(__dirname, '..', 'morgan.log'), {flags: 'a'})
    }));
  }
  /** Log all requests to console */
  else {
    app.use(morgan('dev'));
  }

  /** Initialize Passport */
  passport(app);

  /** Set routes */
  routes(app);

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
