const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const morgan = require('morgan');
const routes = require('../../api/routes');
const config = require('../../config');

module.exports = (app) => {
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