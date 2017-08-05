const request = require('request');
const yelp = require('../config/credentials').yelp;

function getToken(req, res, next) {
  const options = {
    method: 'POST',
    uri: 'https://api.yelp.com/oauth2/token',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    form: {
      client_secret: yelp.client_secret,
      client_id: yelp.client_id 
    }
  };
  
  request(options, (err, response, body) => {
    if (err || response.statusCode !== 200) {
      err.message = 'Yelp token request failed';      
      return next(err);
    }
    body = JSON.parse(body);
    res.yelpToken = `${body.token_type} ${body.access_token}`;
    next();
  });
}

module.exports = { getToken };
