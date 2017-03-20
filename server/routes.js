var mongoose = require('mongoose'); // do we need to require this again?
var Promise = require('bluebird');
var twitterOptions = require('./APIOptions/twitterOptions.js');
var twitterController = require('./controllers/twitterApiController.js');
var watson = require('./controllers/watson.js');
var Tweet = require('./controllers/dbController.js');

// Promisify API calls
var promiseTwitter = Promise.promisify(twitterController.getRequestTwitter);
var promiseWatson = Promise.promisify(watson.getTone);

module.exports = function(app, express) {

	app.post('/api/handle', function(req, res) {

		// Final object sent to front end that includes watson response object and user details
		var frontEndResponse = {};

		console.log("I'M HERERERE...in routes.js, app.post(/api/handle). before promiseTwitter. req.body = ", req.body);
		promiseTwitter(twitterOptions, req.body.handle)
			.then(function(result) {
				frontEndResponse.handle = result.screen_name;
				frontEndResponse.imageUrl = result.profile_image_url;
				frontEndResponse.location = result.location || "none provided";
				frontEndResponse.name = result.name || "none provided";
				frontEndResponse.description = result.description || "none provided";
				frontEndResponse.followers = result.followers_count;
				frontEndResponse.friends = result.friends_count;
				frontEndResponse.watsonResults = {};
				frontEndResponse.tweets = result.tweets;
				promiseWatson(result.finalString)
					.then(function(result) {
						console.log('in routes.js, app.post(/api/handle), promiseWatson, l 31. result about to be sent to db = ', result);
						for (var key in result) {
	      			frontEndResponse.watsonResults[key] = (result[key].score !== result[key].score) ? 0 : result[key].score;
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
