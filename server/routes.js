var mongoose = require('mongoose'); // do we need to require this again?
var Promise = require('bluebird');
var twitterOptions = require('./APIOptions/twitterOptions.js');
var twitterController = require('./controllers/twitterApiController.js');
var watson = require('./controllers/watson.js');
var Tweet = require('./controllers/dbController.js');

// Promisify API calls
var promiseTwitter = Promise.promisify(twitterController.getRequestTwitter);
var promiseWatson = Promise.promisify(watson.getTone);

// var router = require('express').Router();

module.exports = function(app, express) {

	app.post('/api/handle', function(req, res) {

		// Final object sent to front end that includes watson response object and user details
		var frontEndResponse = {};

		console.log("I'M HERERERE...in routes.js, app.post(/api/handle). before promiseTwitter. req.body = ", req.body);
		promiseTwitter(twitterOptions, req.body.handle)
			.then(function(result) {
				// console.log('in routes.js, app.post(/api/handle), promiseTwitter, l 28. result about to be sent to watson = ', result);
				frontEndResponse.handle = result.screen_name;
				frontEndResponse.imageUrl = result.profile_image_url;
				frontEndResponse.location = result.location;
				frontEndResponse.name = result.name;
				frontEndResponse.description = result.description;
				frontEndResponse.followers = result.followers_count;
				frontEndResponse.friends = result.friends_count;
				frontEndResponse.watsonResults = {};
				promiseWatson(result.finalString)
					.then(function(result) {
						console.log('in routes.js, app.post(/api/handle), promiseWatson, l 31. result about to be sent to db = ', result);
						for (var key in result) {
	      			frontEndResponse.watsonResults[key] = result[key].score;
	      		}
						console.log('\n\nin routes.js. l 40. promiseWatson result obj = final Object*&*&*&*&*&*&*&*&', frontEndResponse, '\n\n');
						Tweet.saveToDB(frontEndResponse);
						res.send(frontEndResponse);
					})
					.catch(function(err) {
						console.error(err);
						res.status(400).send('whoops');
					});
			})
			.catch(function(err) {
				console.error(err);
				res.status(400).send(err.errors[0].code.toString());
			});
	});

	app.post('/api/id/:id', function(req, res) {
		let id = req.params.id;
		console.log('in routes.js, app.get(api/archives/:id), line 42. id queried = ', id);
		Tweet.findResultsById(req, res, id)
	});

	app.get('/api/archives', function(req, res) {
		Tweet.getArchives(req, res);

  });

  app.get('/api/killdb', function(req, res) {
  	Tweet.emptyDatabase(req, res);
  })
};



// promiseWatson result obj =  { Anger: 0.10487240677966098,
//   Disgust: 0.07544283050847456,
//   Fear: 0.11776201694915257,
//   Joy: 0.3082714576271186,
//   Sadness: 0.2667793728813559,
//   Analytical: 0.13726845762711865,
//   Confident: 0.10520130508474576,
//   Tentative: 0.10431433898305084,
//   Openness: 0.32089301694915257,
//   Conscientiousness: 0.3026000677966102,
//   Extraversion: 0.4355325762711864,
//   Agreeableness: 0.44270649152542374,
//   EmotionalRange: 0.3916283898305084 }
