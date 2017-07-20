const express = require('express');
const request = require('request');
const config = require('../config/yelp');
const router = express.Router();

function getToken(req, res, next) {
  const options = {
    method: 'POST',
    uri: 'https://api.yelp.com/oauth2/token',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    form: {
      client_secret: config.client_secret,
      client_id: config.client_id 
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

router.post('/search', getToken, (req, res, next) => {
  const queryParams = req.body;

  if (!queryParams.location && (!queryParams.longitude && !queryParams.latitude)) {
    const err = new Error('Please specify a location or a latitude and longitude');
    return next(err);
  }

  Object.assign(queryParams, {categories: 'vegan'});

  const options = {
    method: 'GET',
    uri: 'https://api.yelp.com/v3/businesses/search',
    headers: { authorization: res.yelpToken },
    qs: queryParams
  };

  request(options, (err, response, body) => {
    if (err || response.statusCode !== 200) {
      err.message = 'Yelp search request failed';      
      return next(err);
    }
    body = JSON.parse(body);
    res.send(body);
  });
});

module.exports = router;