var morgan = require('morgan');
var request = require('request');


module.exports = {
	getRequestTwitter: function(optionsTwitter, handle, callback) {
		optionsTwitter.options.qs['screen_name'] = handle;
		request(optionsTwitter.options, function(error, response, body) {
			if(error) {
				console.log(error, 'error in twitter API get request');
				// throw new Error(error);
			} else {
				var responseObject = JSON.parse(body);
				var finalString =  tweetParser(responseObject)
				callback(error, finalString);
			}
		})
	}
};

var tweetParser = function(twitterResponseArray) {
	var stringForWatson = '';
	twitterResponseArray.forEach(function(tweetObject) {
	stringForWatson += tweetObject.text+". ";
	})
	return stringForWatson;
};
