var Q = require('q');
var TweetModel = require('../DB/models/tweetModel.js');

// Promisify mongoose methods with `q` promise library
var findAllSearches = Q.nbind(TweetModel.find, TweetModel);
var findOne = Q.nbind(TweetModel.findOne, TweetModel);
var saveASearch = Q.nbind(TweetModel.create, TweetModel);

module.exports = {
  saveToDB: function(handle, watsonResults) {
   console.log('in dbController, saveToDB, line 11. about to call saveASearch. handle...watsonResults = \n\n', handle, '...', watsonResults);
    saveASearch({
      handle: handle,
      watsonResults: watsonResults  // watsonResults value is object returned from promiseWatson in routes.js line 23
    })
      .then(function() {
        console.log('\n\nin dbController, saveToDB, line 17. handle & watsonResults saved to db!!!!!!!');
      })
      .fail(function (error) {
        console.log('\n\nin dbController, saveToDB, line 20. failed! error = ', error);
        next(error);
       })  // Based on Q documentation, I think safest to use .fail here: "If you are writing JavaScript for modern engines only or using CoffeeScript, you may use catch instead of fail."
  },

  findResultsByTimestamp: function(req, res, timestamp) {
    console.log('in dbController, findResultsByTimestamp, line 26. about to call findOne\n\n');
    findOne({timestamp: timestamp}, 'handle watsonResults timestamp',
    function (err, result) {
       if (err) {console.error(err); }
       console.log('database findOne query returned: ', result)
    }
  )
  .then(function(result) {
    res.status(200).send(result);
  });
  },
  getArchives: function(req, res) {
    console.log('\nin dbController, getArchives, line 38. about to call findAllSearches\n\n');
    findAllSearches( { } )
      .then(function(returnedObj) {
        console.log('\n\nin dbController, getArchives, line 41. database findAllSearches query returned this: ', returnedObj);
        res.send(returnedObj);
      })
      .fail(function (error) {
        console.log('\nin dbController, getArchives, line 45. error in findAllSearches = ', error); // will err until connected with updated watson results object (we changed the schema back to only hold results, not count)
        res.status(400).send('whoops');
      });
  }
};


// Mongoose: find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
// })
