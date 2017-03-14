// var env = require('dotenv'); // will use this later but not working now so require('./.env') for now
var envVars = require('../../env.json');

var bearer_token = {"token_type":"bearer","access_token":"AAAAAAAAAAAAAAAAAAAAAN0yzgAAAAAAuA1ty4YD%2BOQX6jCnVa%2Fwk%2FnfNhI%3DpF9GEBB3hTF617KlRVcJFPX8naMLQZBqgD2tiDTU2zbOJGhfCW"}
module.exports = {
    options: {
        method: 'GET',
        url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
        qs: {
            screen_name: "jpackel",
            count:'30'

        },
        json: true,
        headers: {
            "Authorization": "Bearer " + bearer_token["access_token"]
        }
    }
}