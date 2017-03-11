// Need to agree upon module and scope variable names

angular.module('sentiment.ly',[savedController])

.factory('tone', function() {

  var averageValues = {
    "Anger":0,
    "Disgust":0,
    "Fear":0,
    "Joy":0,
    "Sadness":0,
    "Analytical":0,
    "Content":0,
    "Tentative":0,
    "Openness":0,
    "Conscientiousness":0,
    "Extraversion":0,
    "Agreeableness":0,
    "EmotionalRange":0
  };

  var grabValues = function(data) {
    for (var key in tone.averageValues) {
      tone.averageValues[key] = /*TBD data structure*/[key];
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
        url: '/api/:timestamp',
        /* rest TBD*/
      })
      .then (function(data) {
        archives.lastFiveSearches = data /*TBD data structure*/;
      })
    };

    return {
      lastFiveSearches:lastFiveSearches,
      getArchives:getArchives
    }

})

.controller('sentimentController', function ($scope,$http,tone,archives) {

  $scope.searchRequest = function() {
    $http({
      method: 'POST',
      url: '/api/handle',
      headers: { 'Content-Type': 'application/json' }, /*should be text instead of JSON?*/
      data: {handle: $scope.searchRequestInput} /*should be text instead of JSON?*/
    })
    .then (
      tone.grabValues(data /*TBD data structure*/);
      $scope.averageValues = tone.averageValues;
      archives.getArchives(); /* Repopulates array for saved searches, to be rendered*/
  )};

})

.controller('savedController', function ($scope,$http,tone,archives) {

  $scope.getSaved = function() {
    $http({
      method: 'POST',
      url: '/api/:timestamp',
      headers: { 'Content-Type': 'application/json' }, /*should be text instead of JSON?*/
      data: { savedSearch: $scope.savedSearch }. /*should be text instead of JSON?*/
    })
    .then (
      tone.grabValues(data /*TBD data structure*/);
  )};

})

// Trying to figure out how to get result of savedController grabValues to trigger re-render on
// sentimentController.  Parent-child relationship?