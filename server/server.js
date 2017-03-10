var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

// make connection to mongoose database
mongoose.connect('mongodb://localhost/databaseName');

// use middleware
app.use(bodyParser.json());
app.use(morgan('combined'));

// server static files in public
app.use(express.static());
