var Q = require('q');
var TweetModel = require('../DB/models/tweetModel.js');

// Promisify mongoose methods with `q` promise library
var findAllSearches = Q.nbind(TweetModel.find, TweetModel);
var findOne = Q.nbind(TweetModel.findOne, TweetModel);
var saveASearch = Q.nbind(TweetModel.create, TweetModel);
var empty = Q.nbind(TweetModel.remove, TweetModel);

module.exports = {
  saveToDB: function(resultsObject) {
   // console.log('in dbController, saveToDB, line 11. about to call saveASearch. handle...watsonResults = \n', handle, '...', watsonResults);
   console.log('IN SAVE-TO-DB, ABOUT TO SAVE ', resultsObject);
   new TweetModel(resultsObject)
     .save(function (e) {
       console.log('Item saved in database');
     });
    // saveASearch({
    //   handle: handle,
    //   watsonResults: watsonResults  // watsonResults value is object returned from promiseWatson in routes.js line 23
    // })
    //   .then(function() {
    //     console.log('\n\nin dbController, saveToDB, line 17. handle & watsonResults saved to db!!!!!!!');
    //   })
    //   .fail(function (error) {
    //     console.log('\n\nin dbController, saveToDB, line 20. failed! error = '/*, error*/);
    //     next(error);
    //    })  // Based on Q documentation, I think safest to use .fail here: "If you are writing JavaScript for modern engines only or using CoffeeScript, you may use catch instead of fail."
  },

  findResultsById: function(req, res, id) {
    console.log('in dbController, findResultsById, line 26. about to call findOne\n\n');
    findOne({_id: id})
      .then(function(result) {
        console.log('IN FIND BY ID THEN, RESULT =', result);
        res.send(result);
      })
      .fail(function (error) {
        console.log('FIND RESULT BY ID ERROR ', error);
        res.status(400).send('whoops');
      });
  },

  getArchives: function(req, res) {
    console.log('\nin dbController, getArchives, line 38. about to call findAllSearches\n\n');
    findAllSearches( { } )
      .then(function(returnedObj) {
        // console.log('\n\nin dbController, getArchives, line 41. database findAllSearches query returned this: \n', returnedObj);
        res.send(returnedObj);
      })
      .fail(function (error) {
        console.log('\nin dbController, getArchives, line 45. error in findAllSearches = ', error); // will err until connected with updated watson results object (we changed the schema back to only hold results, not count)
        res.status(400).send('whoops');
      });
  },

  emptyDatabase: function(req, res) {
    console.log('GETTING READY TO DELETE!');
    empty( {} )
      .then(function() {
        return findAllSearches( {} )
      })
      .then(function(results) {
        console.log('Database now equals = ', results);
        res.sendStatus(200);
      })
      .fail(function (error) {
        console.log('DB EMPTYING ERROR ', error);
        res.status(400).send('whoops');
      })
  }

};


// Mongoose: find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
// })
