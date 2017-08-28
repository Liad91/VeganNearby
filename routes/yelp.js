const express = require('express');
const request = require('request');
const authenticate = require('./../middlewares/yelp').authenticate;
const router = express.Router();

router.post('/search', authenticate, (req, res, next) => {
  const queryParams = req.body;

  if (!queryParams.location && (!queryParams.longitude && !queryParams.latitude)) {
    const err = new Error('Please specify a location or a latitude and longitude');
    return next(err);
  }

  Object.assign(queryParams, {term: 'vegan'});

  const options = {
    method: 'GET',
    uri: 'https://api.yelp.com/v3/businesses/search',
    headers: { authorization: res.yelpToken },
    qs: queryParams,
  };

  request(options, (err, response, body) => {
    if (err) {
      err.message = 'Yelp search request failed';      
      return next(err);
    }
    if (response.statusCode >= 500) {
      const err = new Error('Yelp search request failed');

      return next(err);
    }
    body = JSON.parse(body);
    res.send(body);
  });
});

module.exports = router;
