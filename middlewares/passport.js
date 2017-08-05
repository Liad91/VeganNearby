const express = require('express');
const passport = require('passport');
const setStrategies = require('./passport-strategies');
const app = express();

function initializePassport() {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  setStrategies();
}

module.exports = initializePassport;
