var mongoose = require('mongoose');

var tweetSchema = new mongoose.Schema({
	handle: String,
	watsonResults: { // in order of result.data from promiseWatson
		Agreeableness: Number,
		Analytical: Number,
		Anger: Number,
		Confident: Number,
		Conscientiousness: Number,
		Disgust: Number,
		EmotionalRange: Number,
		Extraversion: Number,
		Fear: Number,
		Joy: Number,
		Openness: Number,
		Sadness: Number,
		Tentative: Number},
	timestamp: {type : Date, default: Date.now},
	imageUrl: String, // we're not using these 3 yet
	tweet: String, // we're not using these 3 yet
	location: String // we're not using these 3 yet
});

var TweetModel = mongoose.model('Tweet', tweetSchema);

module.exports = TweetModel;
