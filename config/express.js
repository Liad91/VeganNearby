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
  if (process.env.NODE_ENV === 'production') {
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

  /** 
   * Allow CORS - Cross Origin Resource Sharing (in development) 
   * Redirect non www requests (in production)
  */
  if (process.env.NODE_ENV === 'production') {
    app.get('/*', (req, res, next) => {
      if (req.headers.host.slice(0, 4) === 'www.') {
        return next();
      }
      res.redirect(301, `${req.protocol}://www.${req.headers.host}/${req.url}`);
    })
  }
  else {
    app.use(cors());
  }

  /** Set API routes */
  routes(app);

  /** Fallback to Angular (in production) */
  if (process.env.NODE_ENV === 'production') {
    app.get('/*',  (req, res, next) => {
      res.sendFile(path.join(__dirname, '..', 'dist', 'index.html')); 
    });
  }

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
