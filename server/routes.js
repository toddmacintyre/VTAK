var mongoose = require('mongoose'); // do we need to require this again?
var Promise = require('bluebird');
var twitterOptions = require('./APIOptions/twitterOptions.js');
var twitterController = require('./controllers/twitterApiController.js');
var watson = require('./watson.js');

// Promisify API calls
var promiseTwitter = Promise.promisify(twitterController.getRequestTwitter);
var promiseWatson = Promise.promisify(watson.getTone);

// var router = require('express').Router();

module.exports = function(app, express) {

	app.post('/api/handle', function(req, res) {
		promiseTwitter(twitterOptions, req.body.handle)
			.then(function(result) {
				//  invoke watson API call here
				promiseWatson(result)
					// does this return promise to be resolved or actual value?
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

	app.get('api/:timestamp', function(req, res) {
		let timestamp = req.params.timestamp;
		Tweet.findOne({'timestamp': timestamp}, function(err, tweet) {
			if (err) {
				console.error(err);
				res.status(400).send('whoops');
			} else {
				res.send(tweet);
			}
		});
	});

	app.get('api/archives', function(req,res){
		Tweet.find({}).exec(function(err, archive){
			res.send(archive);
		});
	})
};
