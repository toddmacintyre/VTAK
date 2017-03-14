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
            if (error) {
                console.log(error, 'error in twitter API get request');
                callback(error);
                // throw new Error(error);
            } else {
            	// console.log(body, "herioioioioioio")
                // var responseObject = JSON.parse(body);
                var responseObject = body;
                var finalString = tweetParser(responseObject)
                console.log(finalString, "FINAL STRININININIGIGIGI")
                callback(error, finalString);
            }
        })
    }
};

var tweetParser = function(twitterResponseArray) {
    var stringForWatson = '';
    // console.log(twitterResponseArray, "RESP ARRAYAYAYAY")
    twitterResponseArray.forEach(function(tweetObject) {
        stringForWatson += tweetObject.text + ". ";
    })
    return stringForWatson;
};