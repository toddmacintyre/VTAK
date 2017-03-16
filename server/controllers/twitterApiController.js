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
        		friends_count:0
        	};
            if (error) {
                console.log(error, '\n\nerror in twitter API get request');
                callback(error);
                // throw new Error(error);
            } else if (body.errors) {
                console.log('IN TWITTER API CONTROLLER', body);
                callback(body);
            } else {
                var responseObject = body;
                var finalString = tweetParser(responseObject)
                twitterAPIResponseObject.finalString = finalString;
                twitterAPIResponseObject.profile_image_url= body[0].user.profile_image_url;
                twitterAPIResponseObject.name=body[0].user.name;
                twitterAPIResponseObject.screen_name=body[0].user.screen_name;
                twitterAPIResponseObject.location=body[0].user.location;
                twitterAPIResponseObject.description=body[0].user.description;
                twitterAPIResponseObject.followers_count=body[0].user.followers_count;
                twitterAPIResponseObject.friends_count=body[0].user.friends_count;
                console.log("\n\nin twitterApiController, FINAL STRINGINININIGIGIGI is: ", finalString);

                // console.logs for debugging

                // console.log(twitterAPIResponseObject.finalString,"bodyo________*******&*&*&*")
                // console.log(twitterAPIResponseObject.name,"bodyo________*******&*&*&*")
                // console.log(twitterAPIResponseObject.profile_image_url,"bodyo________*******&*&*&*")
                // console.log(twitterAPIResponseObject.screen_name,"bodyo________*******&*&*&*")
                // console.log(twitterAPIResponseObject.location,"bodyo________*******&*&*&*")
                // console.log(twitterAPIResponseObject.description,"bodyo________*******&*&*&*")
                // console.log(twitterAPIResponseObject.followers_count,"bodyo________*******&*&*&*")
                // console.log(twitterAPIResponseObject.friends_count,"bodyo________*******&*&*&*")

                callback(error, twitterAPIResponseObject);
            }
        });
    }
};

var tweetParser = function(twitterResponseArray) {
    var stringForWatson = '';
    // console.log(twitterResponseArray, "RESP ARRAYAYAYAY")
    twitterResponseArray.forEach(function(tweetObject) {
        stringForWatson += tweetObject.text + ". ";
    })
    // getting error when using Postman for api/handle: "TypeError: twitterResponseArray.forEach is not a function"
    console.log('\n\nin twitterApiController, tweetParser func, line 55. after forEach, stringForWatson = ', stringForWatson);
    return stringForWatson;
};
