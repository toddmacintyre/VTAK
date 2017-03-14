var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
	handle:String,
	imageUrl:String,
	timestamp:String, // Aamir updating to Date? this is timestamp when we write to database, not the twitter timestamp
	tweet:String,
	location:String
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.export = Tweet;
