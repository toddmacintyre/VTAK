angular.module('sentiment.ly-render',[])

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

      var svg = d3.select("#d3Display").append("svg")
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
      var colors = d3.scale.category20();

      var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
        .ticks(10)
        .tickFormat(d3.format("p"))
        .outerTickSize(0)
        // .format('f2');
      var yAxis = d3.svg.axis().scale(yScale).orient("left")
        .outerTickSize(0);

      var render = function(data) {

        xScale.domain([0, d3.max(data, function (d) { return d[xColumn];})]);
        yScale.domain(data.map(function (d) { return d[yColumn]; }));
        colors.domain([0, d3.max(data, function (d) { return d[xColumn];})]);

        xAxisG.call(xAxis);
        yAxisG.call(yAxis);

        var bars = g.selectAll("rect").data(data);

        bars.enter().append("rect")
          // .transition()
          // .duration(500)
          // .ease()
          .attr("height", yScale.rangeBand())
          // .attr("class", "d3Bar") // reference the bars in css using the .d3Bar
          .attr("fill", function(d, i) { return colors(d[xColumn]); })
          .attr("class", function(d, i) { return 'bar_' + d[yColumn] + ' ' + i;} )
          .attr("data-score", function(d) { return d[xColumn];} );
          
        bars
          .attr("x", 0)
          .attr("y", function (d) { return yScale(d[yColumn]); })
          .attr("width", function (d) { return xScale(d[xColumn]); });
        bars.exit().remove();
      }

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