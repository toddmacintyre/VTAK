var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

// Initialize express
var app = express();

// // make connection to mongoose database
// var username = process.env.username;
// var password = process.env.password;
// if (process.env.username && process.env.password) {
//   mongoose.connect(`mongodb://${user}:${pass}@urlocation`);
// } else {
//   mongoose.connect('mongodb://localhost/databaseName');
// }

// use middleware
app.use(bodyParser.json());
app.use(morgan('combined'));

// server static files in public
app.use(express.static('public'));

var port = process.env.PORT || 8222;
app.listen(port, function() {
  console.log('listening on port' + port);
});

// Hook up routes
require('./routes.js')(app, express);