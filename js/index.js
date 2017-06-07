"use strict";

var width = 1000;
var height = 500;

var map = d3.select(".idrowingmotanga").attr("width", width).attr("height", height);

var projection = d3.geoEquirectangular();

var path = d3.geoPath().projection(projection);

var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// powered by myjson.com
d3.json("https://api.myjson.com/bins/r7tvh", function (error, topology) {
  map.selectAll("path").data(topology.features).enter().append("path").attr("d", path);

  drawMeteorite();
});

// crater data provided by freecodecamp.com thank you
var drawMeteorite = function drawMeteorite() {
  d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json", function (error, results) {
    var data = results.features;

    data = _.filter(data, "geometry.coordinates");
    data = _.filter(data, function (d) {
      return !isNaN(parseInt(d.properties.mass));
    });

    var minMass = d3.min(data, function (d) {
      return parseInt(d.properties.mass);
    });
    var maxMass = d3.max(data, function (d) {
      return parseInt(d.properties.mass);
    });

    var scale = d3.scaleSqrt().domain([minMass, maxMass]).range([1, 75]);

    map.selectAll("g").data(data).enter().append("circle").attr("class", "ukasalupa").attr("r", function (d) {
      return scale(parseInt(d.properties.mass));
    }).attr("cx", function (d) {
      return projection(d.geometry.coordinates)[0];
    }).attr("cy", function (d) {
      return projection(d.geometry.coordinates)[1];
    }).on("mouseover", function (d) {
      tooltip.transition().duration(200).style("opacity", .9);
      tooltip.html(d.properties.name + "<br/> Year: " + d.properties.year.substring(0, 4) + "<br/> Mass: " + d.properties.mass).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
    }).on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
  });
};