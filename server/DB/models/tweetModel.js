var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
	handle:String,
	imageUrl:String,
	timestamp:{type : Date, default: Date.now},
	tweet:String,
	location:String
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet; // updated this from module.export
