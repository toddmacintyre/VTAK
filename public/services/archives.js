angular.module('sentiment.ly-archives',[])

  .factory('archives', function ($http) {

      var lastFiveSearches = [];

      var getArchives = function() {
        $http({
          method: 'GET',
          url: '/api/archives',
        })
        .then (function(data) {
          // console.log('in app.js, getArchives after GET req to /api/archives. data received = ###%#%#%#%#%#%# ', data);
          var arrLength = data.data.length;
          // console.log('in app.js, getArchives line 47, after GET req to /api/archives. data received = ', data.data);
          // console.log('in app.js, getArchives line 48, after GET req to /api/archives. array length = ', arrLength);
          lastFiveSearches = [];
            for (var i=arrLength-1; i>arrLength-16; i--) {
            lastFiveSearches.push(data.data[i]);  //Doublecheck data structure. Good idea! It needed .data.
          }
          console.log('in app.js, getArchives line 53, after lastFiveSearches push. lastFiveSearches = ', lastFiveSearches);
          return lastFiveSearches;
        });
      };

      return {
        lastFiveSearches:lastFiveSearches,
        getArchives:getArchives
      }

  });
