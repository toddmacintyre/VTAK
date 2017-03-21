var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var envVars = require('../env.json');

// Initialize express
var app = express();
Access-Control-Allow-Origin: *;

// make connection to mongoose database
var username = envVars.mlab_username;
var password = envVars.mlab_password;
mongoose.connect(`mongodb://${username}:${password}@ds127730.mlab.com:27730/sentiment_db`).then(
  () => { console.log('mongoose connected!')},
  err => { console.log('mongoose connection error!', err) }
);

// use middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true})); // in case we need this later (from Shortly-Angular sprint)
app.use(morgan('dev'));

// server static files in public
app.use(express.static(path.join(__dirname, '../public')));

var port = process.env.PORT || envVars.PORT || 8222;

app.listen(port, function() {
  console.log(`\n\nlistening on port: ${port}`);
});

// Hook up routes
require('./routes.js')(app, express);
