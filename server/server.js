var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var mongoose = require('mongoose');

var env = require('dotenv').config();

// Initialize express
var app = express();

// make connection to mongoose database
var username = process.env.mlab_username;
var password = process.env.mlab_password;
mongoose.connect(`mongodb://${username}:${password}@ds127730.mlab.com:27730/sentiment_db`);

// use middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true})); // in case we need this later (from Shortly-Angular sprint)
app.use(morgan('dev'));

// server static files in public
app.use(express.static(path.join(__dirname, '../public')));

var port = process.env.PORT || 8222;
// var port = 8222; // tested & listening properly (before mongoose connected)
app.listen(port, function() {
  console.log(`listening on port: ${port}`);
});

// Hook up routes
require('./routes.js')(app, express);
