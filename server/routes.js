var mongoose = require('mongoose'); // do we need to require this again?
var Promise = require('bluebird');
var twitterOptions = require('./APIOptions/twitterOptions.js');
var twitterController = require('./controllers/twitterApiController.js');
var watson = require('./watson.js');
var Tweet = require('./DB/models/tweetmodel.js'); // this fixes "ReferenceError: Tweet is not defined"

// Promisify API calls
var promiseTwitter = Promise.promisify(twitterController.getRequestTwitter);
var promiseWatson = Promise.promisify(watson.getTone);

// var router = require('express').Router();

module.exports = function(app, express) {

	app.post('/api/handle', function(req, res) {
		console.log(req.body, "I'M HERERERE")
		promiseTwitter(twitterOptions, req.body.handle)
			.then(function(result) {
				//  invoke watson API call here
				promiseWatson(result)
					.then(function(result) {
						res.send(result);
					})
					.catch(function(err) {
						console.error(err);
						res.status(400).send('whoops');
					});
			})
			.catch(function(err) {
				console.error(err);
				res.status(400).send('whoops');
			});
	});

	app.get('/api/timestamp/:timestamp', function(req, res) {
		let timestamp = req.params.timestamp;
		Tweet.findOne({'timestamp': timestamp}, function(err, tweet) {
			console.log('in routes.js, app.get(api/archives/:timestamp), line 39. timestamp queried = ', timestamp);
      console.log('in routes.js, app.get(api/archives/:timestamp), line 39. findOne data returned from db = ', tweet);
			if (err) {
				console.error(err);
				res.status(400).send('whoops');
			} else {
				res.send(tweet);
			}
		});
	});

	app.get('/api/archives', function(req,res) {
		Tweet.find({}).exec(function(err, archive){
			console.log('in routes.js, app.get(api/archives), line 50. archive data returned from db = ', archive);
			res.send(archive);
		});
	});
};
