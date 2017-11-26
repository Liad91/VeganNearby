const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const routes = require('../../api/routes');
const config = require('../../config');

module.exports = (app) => {
  /** Allow CORS - Cross Origin Resource Sharing */
  app.use(cors());

  /** Set session */
  app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
  }));

  /** Log all requests to console */
  app.use(morgan('dev'));

  /** Set API routes */
  routes(app);
}