var twitterOptions = require('./APIOptions/twitterOptions.js')
var promiseTwitter = Promise.promisify(twitterController.getRequestTwitter);

// var router = require('express').Router();
module.exports = function(app, express){
	app.post('/api/handle', function(req, res){
		promiseTwitter(twitterOptions, req.body.handle).then(function(result){
			//  invoke watson API call here;
		})
	})
	app.get('api/:timestamp',''); // not complete yet
}
