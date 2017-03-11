var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var env = require('./../.env');

// Initialize express
var app = express();

// make connection to mongoose database
// var username = process.env.username; // switch to these when using environment variables set up on deployed host
// var password = process.env.password;
var username = env.username;
var password = env.password;
mongoose.connect(`mongodb://${username}:${password}@ds127730.mlab.com:27730/sentiment_db`);

// use middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// server static files in public
app.use(express.static('public'));

var port = process.env.PORT || 8222;
app.listen(port, function() {
  console.log('listening on port' + port);
});

// Hook up routes
require('./routes.js')(app, express);