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
        var arrLength = data.data.length;
        console.log('in app.js, getArchives line 52, after GET req to /api/archives. data received = ', data.data);
        console.log('in app.js, getArchives line 52, after GET req to /api/archives. array length = ', arrLength);
        lastFiveSearches = [];
        // for (var i=arrLength-1; i<arrLength-5; i--) {
          for (var i=arrLength-1; i>arrLength-6; i--) {
          lastFiveSearches.push(data.data[i]);  //Doublecheck data structure. Good idea! It needed .data.
        }
        console.log('in app.js, getArchives line 57, after lastFiveSearches push. lastFiveSearches = ', lastFiveSearches);
        // return lastFiveSearches;
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
      console.log('about to call getArchives');
      $scope.showArchives = false;

      $scope.archivesData = archives.getArchives(); // I've tried several ways to get this scope data updated; with getArchives().then, error says getArchives() undefined, even though the data is in factory
      console.log('in app.js, searchRequest, line 100. $scope.archivesData = ', $scope.archivesData);
      $scope.showArchives = true;

      // archives.getArchives();
      // $scope.archivesData = archives.lastFiveSearches;
      // console.log('l 98: archives.lastFiveSearches = ', archives.lastFiveSearches);
      // $scope.showArchives = true;
      })
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
   }
   $scope.archivesData = archives.lastFiveSearches;
   console.log('in app.js, l 130. $scope.archivesData = ', $scope.archivesData);
}); // closes sentimentController
