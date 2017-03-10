var morgan = require('morgan');
var request = require('request');


module.exports = {
	getRequestTwitter: function(optionsTwitter, handle, callback){
		optionsTwitter.qs['screen_name'] = handle;
		request(optionsTwitter, function(error, response, body){
			if(error){
				console.log(error, 'error in twitter API get request');
				// throw new Error(error);
			} else {
				var responseOnject = JSON.parse(body);
				var finalString =  tweetParser(responseOnject)
				callback(finalString);
			}
		})
	}
}

var tweetParser function(twitterResponseArray){
	var stringForWatson = '';
	twitterResponseArray.forEach(function(tweetObject){
	stringForWatson += tweetObject.text+". ";
	})
	return stringForWatson;
}


