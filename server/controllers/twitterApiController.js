var morgan = require('morgan');
var request = require('request');

var consumer_key = 'mqWa8AeQ946Xu06JQCVcgdg22';
var consumer_secret = 'saIMEFMAKP8PBSyeBxiDcV7GBhcsUPfyDoqYwTbtI8jguEIi14';
var encode_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');



module.exports = {
    getRequestTwitter: function(optionsTwitter, handle, callback) {
        // var encode_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');
        // var options2 = {
        //     url: 'https://api.twitter.com/oauth2/token',
        //     headers: {
        //         'Authorization': 'Basic ' + encode_secret,
        //         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        //     },
        //     body: 'grant_type=client_credentials'
        // };

        // request.post(options2, function(error, response, body) {
        //     console.log(body, "BEARERRR TOKENNNNNN"); // <<<< This is your BEARER TOKEN !!!
        //     // optionsTwitter.options.headers['Authorization'] = body;
        // });

        //** This request above was to get bearer token, we needed to run it only once **//
        //** Didn't delete it as we might need it again **//

        optionsTwitter.options.qs['screen_name'] = handle;

        request(optionsTwitter.options, function(error, response, body) {
        	var twitterAPIResponseObject = {
        		finalString:'',
        		profile_image_url:'',
        		name:'',
        		screen_name:'',
        		location:'',
        		description:'',
        		followers_count:0,
        		friends_count:0,
                tweets: []
        	};
            if (error) {
                console.log(error, '\n\nerror in twitter API get request');
                callback(error);
            } else if (body.errors || body.error || body.length === 0) {
                if (body.errors) {
                    callback(body);
                } else if (body.error) {
                    callback({"errors":[{"code": 888}]});
                } else {
                    callback({"errors":[{"code": 999}]});
                }
            } else {
                var responseObject = body;
                var parsed = tweetParser(responseObject)
                twitterAPIResponseObject.finalString = parsed[0];
                twitterAPIResponseObject.tweets = parsed[1];
                twitterAPIResponseObject.profile_image_url= body[0].user.profile_image_url.replace("_normal","");
                twitterAPIResponseObject.name=body[0].user.name;
                twitterAPIResponseObject.screen_name=body[0].user.screen_name;
                twitterAPIResponseObject.location=body[0].user.location;
                twitterAPIResponseObject.description=body[0].user.description;
                twitterAPIResponseObject.followers_count=body[0].user.followers_count;
                twitterAPIResponseObject.friends_count=body[0].user.friends_count;
                callback(error, twitterAPIResponseObject);
            }
        });
    }
};

var tweetParser = function(twitterResponseArray) {
    var stringForWatson = '';
    var tweets = [];
    twitterResponseArray.forEach(function(tweetObject) {
        stringForWatson += tweetObject.text + ". ";
        tweets.push(tweetObject.text);
    });
    return [stringForWatson,tweets];
};
