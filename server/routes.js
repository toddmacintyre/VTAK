var twitterController = require('../APIOptions');
var watsonController = require('/');

var router = require('express').Router();
router.get('/api/handle', twitterController.getRequestTwitter);
