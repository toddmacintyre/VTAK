var Q = require('q');
var savedSearch = require('../DB/models/tweetModel.js');

// Promisify mongoose methods with `q` promise library
var findAllSearches = Q.nbind(savedSearch.find, savedSearch);
var findOne = Q.nbind(savedSearch.findOne, savedSearch);
var saveASearch = Q.nbind(savedSearch.create, savedSearch);

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
    });
  },

  findResultsByTimestamp: function(timestamp) {
    console.log('in dbController, findResultsByTimestamp, line 19. about to call findOne\n\n');
    findOne({timestamp: timestamp}, 'handle watsonResults timestamp',
    function (err, result) {
       if (err) {console.error(err)}
       console.log('database findOne query returned: ', result)
    }
  )
  },

  getArchives: function(req, res) {
    console.log('\nin dbController, getArchives, line 25. about to call findAllSearches\n\n');
    // findAllSearches( { } ), 'handle watsonResults timestamp')
    findAllSearches( { } )
      .then(function(returnedObj) {
        console.log('\n\nin dbController, getArchives, line 33. database findAllSearches query returned this: ', returnedObj)
        res.send(returnedObj);
      })
      .fail(function (error) {
        console.log('\nin dbController, getArchives, line 44. error in findAllSearches = ', error);
        res.status(400).send('whoops');
      });
  }
};


// Mongoose: find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
// })
