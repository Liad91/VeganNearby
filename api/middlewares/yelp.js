const request = require('request');
const NodeCache = require( "node-cache" );

const yelp = require('../../config').yelp;
const myCache = new NodeCache();

function authenticate(req, res, next) {
  const token = myCache.get('token');
  if (token) {
    res.yelpToken = token;
    next();
  }
  else {
    getToken()
      .then(() => {
        res.yelpToken = myCache.get('token');
        next();
      })
      .catch(err => {
        next(err);
      })
  }
}

function getToken() {
  const options = {
    method: 'POST',
    uri: 'https://api.yelp.com/oauth2/token',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    form: {
      client_secret: yelp.client_secret,
      client_id: yelp.client_id 
    }
  };

  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        const error = err || new Error();

        error.message = 'Yelp token request failed';      
        return reject(err);
      }
      body = JSON.parse(body);
      myCache.set('token',`${body.token_type} ${body.access_token}`, body.expires_in);
      resolve();
    });
  });
}

module.exports = { authenticate };
