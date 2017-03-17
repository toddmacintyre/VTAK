angular.module('sentiment.ly',['sentiment.ly-tone', 'sentiment.ly-archives', 'sentiment.ly-render'])

.controller('sentimentController', ['$scope', '$http', 'tone', 'archives', 'render', function ($scope,$http,tone,archives,render) {

  $scope.averageValues = {};
  $scope.showResults = false;
  $scope.showArchives = false;
  $scope.spinner = false;
  $scope.archivesData = [];
  $scope.archive = {};

  $scope.errorCodes = {
    "34": 'There is no Twitter user with that handle.  Please try again.',
    "888": "That user's tweets are protected.  Please try again.",
    "999": 'That user has no tweets.  Please try again.'
  };

  $scope.searchRequest = function() {
    $scope.spinner = true;
    $http({
      method: 'POST',
      url: '/api/handle',
      headers: { 'Content-Type': 'application/json' },
      data: {handle: $scope.searchRequestInput}
    })
    .then (function(results) {
      //Results.data has all the information about user in one object, including watson results as another
      //object within this object => results.data.watsonResponseObject, results.data.name, results.data.profile_image_url
      // can be used to access properties/info of that user.
      console.log('in app.js, searchRequest, line 76. results.data = %$%$%$%$%$%$%$', results.data);
      $scope.showResults = false;
      tone.grabValues(results.data.watsonResponseObject);  // Doublecheck data structure
      $scope.averageValues = tone.averageValues;
      console.log('in app.js, searchRequest, line 200. $scope.averageValues = ', $scope.averageValues);
      $scope.spinner = false;
      $scope.showResults = true;
      console.log('about to call getArchives');
      archives.getArchives();

      $scope.showArchives = false;

      $scope.archivesData = archives.lastFiveSearches;
      // $scope.archivesData = archives.getArchives(function(lastFiveSearches) { // callback doesn't work; can't get lastFiveSearches value
      //   return lastFiveSearches;
      // });

      console.log('in app.js, searchRequest, line 213. $scope.archivesData = ', $scope.archivesData);
      $scope.showArchives = true;
      $scope.userData = results.data;
      console.log('in app.js, searchRequest, line 215. about to render. $scope.averageValues = ', $scope.averageValues);
      render.renderData($scope.averageValues);
    })
    .catch(function(error) {
      $scope.spinner = false;
      console.log(error);
      alert($scope.errorCodes[error.data]);
    });
  };

  $scope.getSaved = function(archive) {
    $http({
      method: 'POST',
      url: '/api/timestamp/'+$archive.timestamp,
      headers: { 'Content-Type': 'application/json' }
    })
    .then (function(results) {
      $scope.showResults = false;
      $scope.spinner = true;
      tone.grabValues(results.data);   // Doublecheck data structure
      $scope.averageValues = tone.averageValues;
      $scope.spinner = false;
      $scope.showResults = true;
    });
  //
  archives.getArchives(); // see note in line 96 about getting this value
  $scope.archivesData = archives.lastFiveSearches;
  $scope.showArchives = true;

  };
}]);


// create render factory
// call render from within getSaved and searchRequest
