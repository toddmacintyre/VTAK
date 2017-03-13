var mongoose = require('mongoose'); // do we need to require this again?
var twitterOptions = require('./APIOptions/twitterOptions.js');
var twitterController = require('./controllers/twitterApiController.js');
var watson = require('./watson.js');
var promiseTwitter = Promise.promisify(twitterController.getRequestTwitter);

// var router = require('express').Router();
module.exports = function(app, express) {

	let avgerageValues = {};

	app.post('/api/handle', function(req, res) {
		promiseTwitter(twitterOptions, req.body.handle)
			.then(function(result) {
				//  invoke watson API call here
				watson.getTone(result)
					// does this return promise to be resolved or actual value?
					.then(function(result) {
						res.send(result);
					})
					.catch(function(err) {
						console.error(err);
						res.status(400).send('whoops');
					});
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
};