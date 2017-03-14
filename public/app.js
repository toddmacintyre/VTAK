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
    "EmotionalRange":0
  };

  var grabValues = function(data) {
    for (var key in tone.averageValues) {
      tone.averageValues[key] = data[key];   // Doublecheck data structure
    }
  };

  return {
    averageValues: averageValues,
    grabValues: grabValues
  }

})

.factory('archives', function () {

    var lastFiveSearches = [];

    var getArchives = function() {
      $http({
        method: 'GET',
        url: '/api/archives',
      })
      .then (function(data) {
        archives.lastFiveSearches = [];
        for (var i=0; i<5; i++) {
          archives.lastFiveSearches.push(data[i]);  //Doublecheck data structure
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
  $scope.archivesData = [];

  $scope.searchRequest = function() {
    $http({
      method: 'POST',
      url: '/api/handle',
      headers: { 'Content-Type': 'application/json' },
      data: {handle: $scope.searchRequestInput}
    })
    .then (function(results) {
      $scope.showResults = false;
      tone.grabValues(results.data);  // Doublecheck data structure
      $scope.averageValues = tone.averageValues;
      $scope.showResults = true;
      archives.getArchives();
      $scope.showArchives = false;
      $scope.archivesData = archives.lastFiveSearches;
      $scope.showArchives = true;
    });

  $scope.getSaved = function() {
    $http({
      method: 'GET',
      url: '/api/'+$scope.savedSearch
    })
    .then (function(results) {
      $scope.showResults = false;
      tone.grabValues(results.data);   // Doublecheck data structure
      $scope.averageValues = tone.averageValues;
      $scope.showResults = true;
  });

  archives.getArchives();
  $scope.archivesData = archives.lastFiveSearches;
  $scope.showArchives = true;

  };
