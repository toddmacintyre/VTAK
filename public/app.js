// Need to agree upon module and scope variable names

angular.module('sentiment.ly',[])

.factory('tone', function() {

  var averageValues = {
    "Anger":0,
    "Disgust":0,
    "Fear":0,
    "Joy":0,
    "Sadness":0,
    "Analytical":0,
    "Confident":0,
    "Tentative":0,
    "Openness":0,
    "Conscientiousness":0,
    "Extraversion":0,
    "Agreeableness":0,
    "Emotional Range":0,
    "EmotionalRange":0
  };

  var grabValues = function(data) {
    for (var key in averageValues) {
      if(key !== 'EmotionalRange'){
      // console.log(data, "dataioioioioioioi")
      averageValues[key] = data[key]['score'];   // Doublecheck data structure
      }
    }
    averageValues['EmotionalRange'] = averageValues["Emotional Range"]
  };

  return {
    averageValues: averageValues,
    grabValues: grabValues
  }

})

.factory('archives', function ($http) {

    var lastFiveSearches = [];
    var archivedSearches = []

    var getArchives = function() {
      $http({
        method: 'GET',
        url: '/api/archives',
      })
      .then (function(data) {
        console.log('in app.js, getArchives after GET req to /api/archives. data received = ', data);
        lastFiveSearches = [];
        for (var i=0; i<5; i++) {
          lastFiveSearches.push(data[i]);  //Doublecheck data structure
        }
      });
    };

    return {
      lastFiveSearches:lastFiveSearches,
      getArchives:getArchives
    }

})

.controller('sentimentController', function ($scope,$http,tone,archives) {

  $scope.averageValues = {};
  $scope.showResults = false;
  $scope.showArchives = false;
  $scope.spinner = false;
  $scope.archivesData = [];
  $scope.archive = {};

  $scope.searchRequest = function() {
    $scope.spinner = true;
    $http({
      method: 'POST',
      url: '/api/handle',
      headers: { 'Content-Type': 'application/json' },
      data: {handle: $scope.searchRequestInput}
    })
    .then (function(results) {
      console.log('in app.js, searchRequest, line 76. results.data = ', results.data);
      $scope.showResults = false;
      tone.grabValues(results.data);  // Doublecheck data structure
      $scope.averageValues = tone.averageValues;
      $scope.spinner = false;
      $scope.showResults = true;
      archives.getArchives();
      $scope.showArchives = false;
      $scope.archivesData = archives.lastFiveSearches;
      $scope.showArchives = true;
    })
    .catch(function(error) {
      $scope.spinner = false;
      console.log(error);
      if(error.data === '34') {
        alert('There is no Twitter user with that handle.  Please try again.');
      } else if (error.data === '999') {
        alert('That user has no tweets.  Please try again.');
      }
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

  archives.getArchives();
  $scope.archivesData = archives.lastFiveSearches;
  $scope.showArchives = true;

  };
});
