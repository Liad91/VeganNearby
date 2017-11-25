const fs = require('fs.extra');
const path = require('path');

const configs = {
  dbUrl: 'mongodb://localhost:XXXXX/vegannearby',
  appUrl: 'http://localhost:4200',
  jwtSecret: 'XXXXX-XXXXX-XXXXX-XXXXX',
  yelp: {
    client_id: "XXXXX-XXXXX-XXXXX-XXXXX",
    client_secret: "XXXXX-XXXXX-XXXXX-XXXXX"
  },
  facebook: {
    appId: 'XXXXX-XXXXX-XXXXX-XXXXX',
    appSecret: 'XXXXX-XXXXX-XXXXX-XXXXX',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  google: {
    clientID: 'XXXXX-XXXXX-XXXXX-XXXXX',
    clientSecret: 'XXXXX-XXXXX-XXXXX-XXXXX',
    callbackURL: 'http://127.0.0.1:3000/auth/google/callback'
  },
  twitter: {
    consumerKey: 'XXXXX-XXXXX-XXXXX-XXXXX',
    consumerSecret: 'XXXXX-XXXXX-XXXXX-XXXXX',
    callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
  }
};

const googleApiKey = 'XXXXX-XXXXX-XXXXX-XXXXX';

/** Create directories recursively */
try {
  fs.mkdirRecursiveSync('./public/images/users');
  fs.mkdirRecursiveSync('./public/images/temp');
}
catch (e) {
  throw e;
}

/** Create credentials file */
try {
  fs.writeFileSync(
    path.resolve('config', 'index.js'),
    `module.exports = ${JSON.stringify(configs, null, 2)}`,
    'utf-8'
  );
}
catch (err) {
  throw err;
}

/** Create config file for Angular */
try {
  fs.writeFileSync(
    path.resolve('angular-src', 'src', 'config.ts'),
    `export const googleApiKey = '${googleApiKey}';\n`,
    'utf-8'
  );
}
catch (err) {
  throw err;
}
