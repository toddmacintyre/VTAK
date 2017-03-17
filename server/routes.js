var mongoose = require('mongoose'); // do we need to require this again?
var Promise = require('bluebird');
var twitterOptions = require('./APIOptions/twitterOptions.js');
var twitterController = require('./controllers/twitterApiController.js');
var watson = require('./watson.js');
var Tweet = require('./controllers/dbController.js');

// Promisify API calls
var promiseTwitter = Promise.promisify(twitterController.getRequestTwitter);
var promiseWatson = Promise.promisify(watson.getTone);

// var promiseGetArchives = Promise.promisify(Tweet.getArchives);

// var router = require('express').Router();

module.exports = function(app, express) {

	app.post('/api/handle', function(req, res) {

		// Final object sent to front end that includes watson response object and user details
		var frontEndResponse = {
		};
		// Final object sent to front end that includes watson response object and user details

		console.log("I'M HERERERE...in routes.js, app.post(/api/handle). before promiseTwitter. req.body = ", req.body);
		promiseTwitter(twitterOptions, req.body.handle)
			.then(function(result) {
				console.log('in routes.js, app.post(/api/handle), promiseTwitter, l 28. result about to be sent to watson = ', result);
				frontEndResponse = result;
				promiseWatson(result.finalString)
					.then(function(result) {
						console.log('in routes.js, app.post(/api/handle), promiseWatson, l 31. result about to be sent to db = ', result);
						Tweet.saveToDB(req.body.handle, result);
						// testing with this obj below confirmed that we are writing to db. But input for database needs to be updated to just include watson values, not score/count object currently ({ Anger: { score: 0, count: 0 })
						// Tweet.saveToDB(req.body.handle,
				// 			{ Anger: 0.09,
	      //  Disgust: 0.16
	      //  }
						)
						frontEndResponse['watsonResponseObject'] = result;
						// console.log('\n\nin routes.js. promiseWatson result obj = final Object*&*&*&*&*&*&*&*&', frontEndResponse, '\n\n'); // see format below
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

	// what we had: Tweet.findOne({'timestamp': timestamp}, function(err, tweet) { // we want this to call the dbController, which connects to model, not model directly (similar to Shortly-Angular); also updated from callback to promise
	app.get('/api/timestamp/:timestamp', function(req, res) {
		let timestamp = req.params.timestamp;
		console.log('in routes.js, app.get(api/archives/:timestamp), line 42. timestamp queried = ', timestamp);
		Tweet.findResultsByTimestamp(req, res, timestamp)
		  .then(function(findOneResult) {
      console.log('in routes.js, app.get(api/archives/:timestamp), line 46. findOne data returned from db = ', findOneResult);
			if (findOneResult === null) {
				console.log('in routes.js, app.get(api/archives/:timestamp), line 48. findOneResult returned null');
				res.status(400).send('whoops');
			  } else {
				res.send(findOneResult);
			  }
		 });
	});

	app.get('/api/archives', function(req, res) {
		Tweet.getArchives(req, res);

  });
};

// tried approach of promisifying this call to dbController but it didn't work; reverting to res.send from dbController for now
// promiseGetArchives()
// 	.then(function(archivesResults) {
// 	console.log('in routes.js, app.get(api/archives), line 58. getArchives data returned from db = \n', archivesResults);
// 	if (archivesResults === null) {
// 		console.log('in routes.js, app.get(/api/archives), line 61. archivesResults returned null');
// 		res.status(400).send('whoops');
// 		} else {
// 		res.send(archivesResults);
// 		}
// });

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
