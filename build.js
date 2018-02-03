const fs = require('fs.extra');
const path = require('path');
const inquirer = require('inquirer');

let googleApiKey;

const configs = {
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',
  yelp: {},
  facebook: {
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  google: {
    callbackURL: 'http://127.0.0.1:3000/auth/google/callback'
  },
  twitter: {
    callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
  }
};

const questions = [
  {
    type: 'input',
    name: 'dbUrl',
    message: 'Enter Your Database URL:',
    default: 'mongodb://localhost:27017/vegannearby'
  },
  {
    type: 'input',
    name: 'jwtSecret',
    message: 'Enter Your JWT secret:',
    default: 'XXXXX-XXXXX-XXXXX-XXXXX'
  },
  {
    type: 'input',
    name: 'yelpApiKey',
    message: 'Enter Your Yelp API Key:',
    default: 'XXXXX-XXXXX-XXXXX-XXXXX'
  },
  {
    type: 'input',
    name: 'fbAppId',
    message: 'Enter Your Facebook App ID:',
    default: 'XXXXX-XXXXX-XXXXX-XXXXX'
  },
  {
    type: 'input',
    name: 'fbAppSecret',
    message: 'Enter Your Facebook App Secret:',
    default: 'XXXXX-XXXXX-XXXXX-XXXXX'
  },
  {
    type: 'input',
    name: 'googleApiKey',
    message: 'Enter Your Google API Key:',
    default: 'XXXXX-XXXXX-XXXXX-XXXXX'
  },
  {
    type: 'input',
    name: 'googleClientId',
    message: 'Enter Your Google Client ID:',
    default: 'XXXXX-XXXXX-XXXXX-XXXXX'
  },
  {
    type: 'input',
    name: 'googleClientSecret',
    message: 'Enter Your Google Client Secret:',
    default: 'XXXXX-XXXXX-XXXXX-XXXXX'
  },
  {
    type: 'input',
    name: 'twitterConsumerKey',
    message: 'Enter Your Twitter Consumer Key:',
    default: 'XXXXX-XXXXX-XXXXX-XXXXX'
  },
  {
    type: 'input',
    name: 'twitterConsumerSecret',
    message: 'Enter Your Twitter Consumer Secret:',
    default: 'XXXXX-XXXXX-XXXXX-XXXXX'
  }
];

inquirer.prompt(questions)
  .then(answers => {
    configs.dbUrl = answers.dbUrl;
    configs.secret = answers.jwtSecret;
    configs.yelp.apiKey = answers.yelpApiKey;
    configs.facebook.appId = answers.fbAppId;
    configs.facebook.appSecret = answers.fbAppSecret;
    configs.google.clientID = answers.googleClientId;
    configs.google.clientSecret = answers.googleClientSecret;
    configs.twitter.consumerKey = answers.twitterConsumerKey;
    configs.twitter.consumerSecret = answers.twitterConsumerSecret;
    googleApiKey = answers.googleApiKey;
  })
  .then(() => {
    /** Create directories recursively */
    try {
      fs.mkdirRecursiveSync('./public/images/users');
      fs.mkdirRecursiveSync('./public/images/temp');
      console.info('folder structure created successfully');
    }
    catch (err) {
      throw err;
    }

    /** Create credentials file */
    try {
      fs.writeFileSync(
        path.resolve('config', 'index.js'),
        `module.exports = ${JSON.stringify(configs, null, 2)}`,
        'utf-8'
      );
      console.info('server config file created successfully');
    }
    catch (err) {
      throw err;
    }

    /** Create config file for Angular */
    try {
      fs.writeFileSync(
        path.resolve('client', 'src', 'config.ts'),
        `export const googleApiKey = '${googleApiKey}';\n`,
        'utf-8'
      );
      console.info('client config file created successfully');
    }
    catch (err) {
      throw err;
    }
  })
  .catch(err => {
    throw err;
  });