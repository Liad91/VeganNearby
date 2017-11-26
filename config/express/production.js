const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const morgan = require('morgan');
const routes = require('../../api/routes');
const config = require('../../config');

module.exports = (app) => {
  /** Redirect non www requests (in production) */
  app.get('/*', (req, res, next) => {
    if (req.get('host').slice(0, 4) === 'www.') {
      return next();
    }
    res.redirect(301, `${req.protocol}://www.${req.get('host')}${req.url}`);
  });

  /** Serve gzipped files for JS and CSS */
  app.get('*.js', (req, res, next) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
  });

  app.get('*.css', (req, res, next) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
    next();
  });

  /** Set static folder */
  app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

  /** Set session */
  app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      path: path.join(__dirname, '..', '..', 'sessions'),
      ttl: 300
    }),
  }));

  /** Log only 4xx and 5xx responses to morgan.log */
  app.use(morgan('common', {
    skip: (req, res) => res.statusCode < 400,
    stream: fs.createWriteStream(path.join(__dirname, '..', '..', 'morgan.log'), {flags: 'a'})
  }));

  /** Set API routes */
  routes(app);

  /** Fallback to Angular (in production) */
  app.get('/*',  (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html')); 
  });
}