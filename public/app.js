angular.module('sentiment.ly',[/*TBD*/])

.controller('sentimentController', function ($scope,$http,tone) {

  $scope.searchRequest = function() {
    $http({
      method: 'POST',
      url: '/api/handle',
      headers: { 'Content-Type': 'application/json' },
      data: {handle: $scope.searchRequestInput}
    })
    .then function(data){
      for (var key in tone.averageValues) {
        tone[key] = /*TBD data structure*/[key];
      }
    }
  }

};

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
  }

  return {averageValues:averageValues}

})