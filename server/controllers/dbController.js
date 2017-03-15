var Q = require('q');
var savedSearch = require('../DB/models/tweetModel.js');

// Promisify mongoose methods with `q` promise library
var findAllSearches = Q.nbind(savedSearch.find, savedSearch);
var findOne = Q.nbind(savedSearch.findOne, savedSearch);
var saveASearch = Q.nbind(savedSearch.create, savedSearch);

module.exports = {
  saveToDB: function(handle, watsonResults) {
    console.log('in dbController, saveToDB, line 11. about to call saveASearch\n\n');
    saveASearch({
      handle: handle,
      watsonResults: watsonResults  // watsonResults value is object returned from promiseWatson in routes.js line 23
    });
  },

  findResultsByTimestamp: function(timestamp) {
    console.log('in dbController, findResultsByTimestamp, line 19. about to call findOne\n\n');
    findOne({timestamp: timestamp}, 'handle watsonResults timestamp', function (err, result) {
       if (err) {console.error(err)}
       console.log('database findOne query returned: ', result)
    })
  },

  getArchives: function() {
    console.log('in dbController, getArchives, line 25. about to call findAllSearches\n\n');
    findAllSearches( { } ), 'handle watsonResults timestamp', function (err, result) {
       if (err) {console.error(err)}
      //  console.log('in dbController, getArchives, line 28. database findAllSearches query returned: ', result, '\n\n')
         console.log('in dbController, getArchives, line 28. database findAllSearches query returned');
    };
  }
};

// Mongoose: find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
// })

//Shortly-Angular ex:
//   app.post('/api/users/signup', userController.signup);
//
// var findAllLinks = Q.nbind(Link.find, Link);
// findAllLinks({})...
//
// findUser({username: username})
//     .then(function (user) {
//       if (user) {
//         next(new Error('User already exist!'));
//       } else {
//         // make a new user if not one
//         return createUser({
//           username: username,
//           password: password
//         });
//       }
//     })
//     .then(function (user) {
//       // create token to send back for auth
//       var token = jwt.encode(user, 'secret');
//       res.json({token: token});
//     })
//     .fail(function (error) {
//       next(error);
//     });
//
//     // schema
//     var tweetSchema = new mongoose.Schema({ // I believe we need 'new' to instantiate, per Shortly-Angular example
//     	handle:String,
//     	imageUrl:String,
//     	timestamp:{type : Date, default: Date.now},
//     	tweet:String,
//     	location:String
//     });
