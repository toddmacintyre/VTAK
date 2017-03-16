var mongoose = require('mongoose');

// var tweetSchema = mongoose.Schema({
var tweetSchema = new mongoose.Schema({ // I believe we need 'new' to instantiate, per Shortly-Angular example
	handle: String,
	watsonResults: { // in order of result.data from promiseWatson
		Agreeableness: {score: Number, count: Number},
		Analytical: {score: Number, count: Number},
		Anger: {score: Number, count: Number},
		Confident: {score: Number, count: Number},
		Conscientiousness: {score: Number, count: Number},
		Disgust: {score: Number, count: Number},
		EmotionalRange: {score: Number, count: Number},
		Extraversion: {score: Number, count: Number},
		Fear: {score: Number, count: Number},
		Joy: {score: Number, count: Number},
		Openness: {score: Number, count: Number},
		Sadness: {score: Number, count: Number},
		Tentative: {score: Number, count: Number}
	},
	timestamp: {type : Date, default: Date.now},
	imageUrl: String, // we're not using these 3 yet
	tweet: String, // we're not using these 3 yet
	location: String // we're not using these 3 yet
});

var TweetModel = mongoose.model('Tweet', tweetSchema);

module.exports = TweetModel; // updated this from module.export

//original:
// Agreeableness: Number,
// Analytical: Number,
// Anger: Number,
// Confident: Number,
// Conscientiousness: Number,
// Disgust: Number,
// EmotionalRange: Number,
// Extraversion: Number,
// Fear: Number,
// Joy: Number,
// Openness: Number,
// Sadness: Number,
// Tentative: Number},
