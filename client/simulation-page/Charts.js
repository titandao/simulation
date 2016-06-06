
Template.lineChart.rendered = function () {
  Session.set('x', ['x', 30, 50, 75, 100, 120]);
  Session.set('data1', ['data1', 30, 200, 100, 400, 150]);
  Session.set('data2', ['data2', 20, 180, 240, 100, 190]);
  var chart = c3.generate({
    bindto: this.find('#lineChart'),
      data: {
        xs: {
          'data1': 'x',
          'data2': 'x'
        },
        columns: [['x'],['data1'],['data2']]
      }
  });

  this.autorun(function (tracker) {
    chart.load({columns: [
      Session.get('x'),
      Session.get('data1'),
      Session.get('data2'),
      []
    ]});
  });
}

//
//
// Template.lineChart.rendered = function() {
//
//
// 	var parentW = $('#simulationViewer').width();
// 	var parentH = $('#simulationViewer').height();
//
//
// 	//Width and height
// 	var margin = {top: 20, right: 20, bottom: 30, left: 50},
// 		width = parentW - margin.left - margin.right,
// 		height = parentH - margin.top - margin.bottom;
//
// 	var x = d3.time.scale()
// 		.range([0, width]);
//
// 	var y = d3.scale.linear()
// 		.range([height, 0]);
//
// 	var xAxis = d3.svg.axis()
// 		.scale(x)
// 		.orient("bottom");
//
// 	var yAxis = d3.svg.axis()
// 		.scale(y)
// 		.orient("left");
//
// 	var line = d3.svg.line()
// 		.x(function(d) {
// 			return x(d.x);
// 		})
// 		.y(function(d) {
// 			return y(d.y);
// 		});
//
// 	var svg = d3.select("#lineChart")
// 		.attr("width", "100%")
// 		.attr("height", "100%")
// 		.append("g")
// 		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// 	svg.append("g")
// 		.attr("class", "x axis")
// 		.attr("transform", "translate(0," + height + ")");
//
// 	svg.append("g")
// 		.attr("class", "y axis")
// 		.append("text")
// 		.attr("transform", "rotate(-90)")
// 		.attr("y", 6)
// 		.attr("dy", ".71em")
// 		.style("text-anchor", "end")
// 		.text("Metric"); // TODO
//
// 	Deps.autorun(function(){
// 		var dataset = [];
// 		for(i = 0; i < 20; i++) {
// 			dataset.push({
// 				x: i*10,
// 				y: i*10
// 			})
// 		};
// 		// var dataset = Points.find({},{sort:{date:-1}}).fetch();
//
// 		var paths = svg.selectAll("path.line")
// 			.data([dataset]); //todo - odd syntax here - should use a key function, but can't seem to get that working
//
// 		x.domain(d3.extent(dataset, function(d) { return d.x; }));
// 		y.domain(d3.extent(dataset, function(d) { return d.y; }));
//
// 		//Update X axis
// 		svg.select(".x.axis")
// 			.transition()
// 			.duration(1000)
// 			.call(xAxis);
//
// 		//Update Y axis
// 		svg.select(".y.axis")
// 			.transition()
// 			.duration(1000)
// 			.call(yAxis);
//
// 		paths
// 			.enter()
// 			.append("path")
// 			.attr("class", "line")
// 			.attr('d', line);
//
// 		paths
// 			.attr('d', line); //todo - should be a transisition, but removed it due to absence of key
//
// 		paths
// 			.exit()
// 			.remove();
// 	});
// };
