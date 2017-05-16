angular.module('sentiment.ly',['sentiment.ly-tone', 'sentiment.ly-render'])

.controller('sentimentController', ['$scope', '$http', 'tone', 'render', function ($scope,$http,tone,render) {

  $scope.averageValues = {};
  $scope.bootup = true;
  $scope.showResults = false;
  $scope.showArchives = false;
  $scope.spinner = false;
  $scope.archivesData = [];
  $scope.archive = {};
  $scope.showTestDriveGif = false;

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
      $scope.showResults = false;
      $scope.userData = results.data;
      tone.grabValues(results.data.watsonResults);  // Doublecheck data structure
      $scope.averageValues = tone.averageValues;
      $scope.spinner = false;
      $scope.bootup = false;
      $scope.showTestDriveGif = false;
      $scope.showResults = true;
      console.log('about to call getArchives');
      $scope.showArchives = false
      $scope.getArchives();
      render.renderData($scope.averageValues);
      $scope.searchRequestInput = '';
    })
    .catch(function(error) {
      $scope.spinner = false;
      console.log(error);
      alert($scope.errorCodes[error.data]);
    });
  };


$scope.getArchives = function() {
  $http({
    method: 'GET',
    url: '/api/archives',
  })
  .then (function(data) {
    var arrLength = data.data.length;
    $scope.archivesData = [];
    for (var i=arrLength-1; i>arrLength-66; i--) {
      if (data.data[i]) {
        $scope.archivesData.push(data.data[i]);
      }
    }
    $scope.archivesData.forEach(function(entry) {
      var cleanTime = entry.timestamp.slice(11,16) + '  ' + entry.timestamp.slice(5,7) + '/' + entry.timestamp.slice(8,10) + '/' + entry.timestamp.slice(0,4);
      entry.timestamp = cleanTime;
    });
    $scope.showArchives = true;
  })
  .catch(function(error) {
    console.log('GETTING ARCHIVES ERROR: ', error);
  });
};



$scope.getSaved = function(archive) {
  $scope.showTestDriveGif = false;
  $http({
    method: 'POST',
    url: '/api/id/'+archive._id,
    headers: { 'Content-Type': 'application/json' }
  })
  .then (function(results) {
    $scope.showResults = false;
    $scope.spinner = true;
    tone.grabValues(results.data.watsonResults);   // Doublecheck data structure
    $scope.averageValues = tone.averageValues;
    $scope.userData = results.data;
    $scope.spinner = false;
    $scope.bootup = false;
    $scope.showResults = true;
    render.renderData($scope.averageValues);
  });
};

$scope.sampleRequest = function() {
  $scope.spinner2 = true;
  $scope.showResults = false;
  $http({
          method: 'POST',
          url: '/api/sample',
          data: {
                sample: $scope.sampleTweetInput || '',
            }
      })
      .then(function(data) {
        $scope.spinner2 = false;
        $scope.bootup = false;
        $scope.showTestDriveGif = true;
        render.renderData(data.data);
        $scope.sampleTweetInput = '';
      })
      .catch(function(error) {
          console.log('GETTING ARCHIVES ERROR: ', error);
      });
};

$scope.getArchives();
$scope.showArchives = true;

}]);
