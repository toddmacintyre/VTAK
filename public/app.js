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

.factory('render', function() {

  var clearRender = function() {
    d3.select("svg").remove();
  }

  var renderData = function(dataToRender) {

    clearRender();

    var outerWidth = 800;
    var outerHeight = 400;
    var margin = { left: 130, top: 0, right: 0, bottom: 30 };
    var barPadding = 0.2;

    var xColumn = "value";
    var yColumn = "name";

    var innerWidth = outerWidth - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top - margin.bottom;

    var svg = d3.select(".d3Display").append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight);
    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xAxisG = g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + innerHeight + ")")
      .attr("class", "gridA");
    var yAxisG = g.append("g")
      .attr("class", "y axis")
      .attr("class", "gridB");

    var xScale = d3.scale.linear().range([0, innerWidth]);
    var yScale = d3.scale.ordinal().rangeBands([0, innerHeight], barPadding);

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
      .ticks(5)
      .tickFormat(d3.format("p"))
      .outerTickSize(0);
    var yAxis = d3.svg.axis().scale(yScale).orient("left")
      .outerTickSize(0);

    var render = function(data) {

      xScale.domain([0, d3.max(data, function (d) { return d[xColumn]; })]);
      yScale.domain(data.map(function (d) { return d[yColumn]; }));

      xAxisG.call(xAxis);
      yAxisG.call(yAxis);

      var bars = g.selectAll("rect").data(data);
      bars.enter().append("rect")
        .attr("height", yScale.rangeBand())
        .attr("class", "d3Bar"); // reference the bars in css using the .d3Bar
      bars
        .attr("x", 0)
        .attr("y", function (d) { return yScale(d[yColumn]); })
        .attr("width", function (d) { return xScale(d[xColumn]); });
      bars.exit().remove();
    }

    // console.log(dataToRender);
    // turn into format that's easy to work with in d3
    let d3JSON_arr = [];
    for (let key in dataToRender) {
      d3JSON_arr.push({'name': key, 'value': dataToRender[key]});
    }

    render(d3JSON_arr);
  }

  // example object. Comment out when wired up with real results.
  // let d3JSON = {
  //   "Anger": 0.10487240677966098,
  //   "Disgust": 0.07544283050847456,
  //   "Fear": 0.11776201694915257,
  //   "Joy": 0.3082714576271186,
  //   "Sadness": 0.2667793728813559,
  //   "Analytical": 0.13726845762711865,
  //   "Confident": 0.10520130508474576,
  //   "Tentative": 0.10431433898305084,
  //   "Openness": 0.32089301694915257,
  //   "Conscientiousness": 0.3026000677966102,
  //   "Extraversion": 0.4355325762711864,
  //   "Agreeableness": 0.44270649152542374,
  //   "EmotionalRange": 0.3916283898305084
  // }

  return {
    renderData: renderData,
    clearRender: clearRender
  }

})

.controller('sentimentController', ['$scope', '$http', 'tone', 'archives', 'render', function ($scope,$http,tone,archives,render) {

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
      // console.log('in app.js, searchRequest, line 76. results.data = ', results.data);
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

      render.renderData($scope.averageValues);
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
