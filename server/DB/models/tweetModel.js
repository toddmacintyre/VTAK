var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
	handle:String,
	imageUrl:String,
	timestamp:String,
	tweet:String,
	location:String
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.export = Tweet;