var twitterController = require('../APIOptions');
var watsonController = require('./watson.js');

// var router = require('express').Router();
module.exports = funnction(app, express){
	app.post('/api/handle', twitterController.getRequestTwitter);
	app.get('api/:timestamp',''); // not complete yet		
}
