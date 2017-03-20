var mongoose = require('mongoose');

var tweetSchema = new mongoose.Schema({
	handle: String,
	watsonResults: { // in order of result.data from promiseWatson
		Agreeableness: {type: Number, default: 0},
		Analytical: {type: Number, default: 0},
		Anger: {type: Number, default: 0},
		Confident: {type: Number, default: 0},
		Conscientiousness: {type: Number, default: 0},
		Disgust: {type: Number, default: 0},
		'Emotional Range': {type: Number, default: 0},
		Extraversion: {type: Number, default: 0},
		Fear: {type: Number, default: 0},
		Joy: {type: Number, default: 0},
		Openness: {type: Number, default: 0},
		Sadness: {type: Number, default: 0},
		Tentative: {type: Number, default: 0}},
	timestamp: {type : Date, default: Date.now},
	imageUrl: String,
	location: String,
	name: String,
	description: String,
	followers: Number,
	friends: Number,
	tweets: [String]
});

var TweetModel = mongoose.model('Tweet', tweetSchema);

module.exports = TweetModel;
