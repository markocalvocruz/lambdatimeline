var parseDate = d3.timeParse("%m/%d/%Y");
var xNudge = 160;
var yNudge = 10;

/*Define Margins *NOT BEING USED CURRENTLY*
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = parseInt(d3.select("#chart-container").style("width")) - margin.left - margin.right,
    height = parseInt(d3.select("#chart-container").style("height")) - margin.top - margin.bottom;
*/
var margin = {top: 20, right: 80, bottom: 30, left: 125};
// Define Colors
var unselectedColor = "#3A3A3A";
var selectedColor = "#21AAD3";


// Define CSV Values
const dateValue = d => d.date;
const titleValue = d => d.title;
const infoValue = d => d.info;
const urlValue = d => d.url;


//Define scales
const yScale = d3.scaleTime();
const yAxis = d3.axisLeft()
	.tickPadding(50)
	.tickFormat(d3.timeFormat("%B"))
	.tickSize(0);


var radius = "20px";


//Define SVG canvas	
var svg = d3.select("#chart")
			//responsive SVG needs these 2 attributes and no width and height attr
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", "0 0 150 1000")
			//.attr("width", width + margin.left + margin.right)
         	//.attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//class to make it responsive
/**
var g = svg.append("g")
			.attr("class","chartGroup")
			.attr("transform","translate("+xNudge+","+yNudge+")");

**/
d3.csv("Lambda.csv").then(function(data) {

	//Process Dates
	data.forEach(function(d) {
		d.date = parseDate(dateValue(d));
		d.radius = 3;
	});


	//Define Timeline Domain
	var minDate = d3.min(data, d => dateValue(d));
	var maxDate = d3.max(data, d => dateValue(d));
	console.log(maxDate,minDate);
	//Config Scale for Vertical Timeline
	yScale 
		.domain([maxDate, minDate])
		.range([0, 1000])
		.nice();

	//Config Axis
	yAxis.scale(yScale)
		.ticks(7); //revisit: arbitrary number 

	//Add Axis to SVG
	svg.append("g")
		.attr("class","axis-y")
		.call(yAxis);



	/* PLOTTING START */

	var node = svg.selectAll('.node')
		.data(data)
		.enter()
		.append("g")
		.attr("class", "node");

	node.append("svg:circle")
		.attr("class", "nodes")
		.attr("cx", 0)
		.attr("cy", d => yScale(dateValue(d)))
		.attr("r", radius)
		.attr("fill", "#3A3A3A")
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);

	/* PLOTTING END */

	/*
	SOMEHOW RELATED TO COLLISION DETECTION
	SOURCE: http://bl.ocks.org/fabiovalse/bf9c070d0fa6bab79d6a
	
	var force = d3.layout.force()
	    .nodes(node)
	    .gravity(.02)
	    .charge(0)
	    .on("tick", tick)
	    .start();

	force.alpha(.05); // speed
	*/
});

/* HELPER FUNCTIONS START */

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity
    // Use D3 to select element, change color and size
    d3.select(".info-container").remove();
    d3.select("#instructions").remove();

    //Change Selected Circle Color
    d3.selectAll("circle")
      	.attr("fill", unselectedColor);


    d3.select(this)
    	.attr("fill", selectedColor)
    	.attr("r", radius);


    var info = d3.select("div#info")
	
	//Event Date
	info.select(".event-date")
		 .text(d.date.toString().slice(4,10));

	//Event Title
	info.select(".event-title")	
        .text(d.title);
    //Event Description
    info.select(".event-description")
    	.text(d.info);

    //Read More Button
    info.select(".read-more-button")
    	.attr("href", d.url)
    	.style("visibility", "visible")
    	.text('Read More \u2192 ');


}


//Handle Mouse Out
function handleMouseOut(d, i) {}

//FastForward Date by X amount of months
Date.prototype.addMonths = function (m) {
    var d = new Date(this);
    var years = Math.floor(m / 12);
    var months = m - (years * 12);
    if (years) d.setFullYear(d.getFullYear() + years);
    if (months) d.setMonth(d.getMonth() + months);
    return d;
}


/*	Responsive
	Define responsive behavior
 	Source : https://bl.ocks.org/josiahdavis/7a02e811360ff00c4eef
*/
function resize() {
  var width = parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
  height = parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;

  // Update the range of the scale with new width/height
  xScale.range([0, width]);
  yScale.range([height, 0]);

  // Update the axis and text with the new scale
  svg.select('.x.axis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.select('.y.axis')
    .call(yAxis);

  // Force D3 to recalculate and update the line
  svg.selectAll('.line')
    .attr("d", function(d) { return line(d.datapoints); });

  // Update the tick marks
  xAxis.ticks(Math.max(width/75, 2));
  yAxis.ticks(Math.max(height/50, 2));

};

//Date function ends


/*	
	SOMEHOW RELATED TO COLLISION DETECION 
	SOURCE: http://bl.ocks.org/fabiovalse/bf9c070d0fa6bab79d6a
*/


/* COLLISION DETECTION: NOT BEING USED 
function tick(e) {
	//force.alpha(.01);

  	circle
		.each(gravity(.4 * e.alpha))
		.each(collide(.5))
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
}

// Resolve collisions between nodes.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

function brushed() {
	var value = brush.extent()[0];

	if (d3.event.sourceEvent) {
		value = x.invert(d3.mouse(this)[0]);
		brush.extent([value, value]);

		force.alpha(.01);
	}

	handle.attr("cx", x(value));

	padding = value;
}


//	Move nodes toward cluster focus.
function gravity(alpha) {
	return function(d) {
		d.y += (d.cy - d.y) * alpha;
		d.x += (d.cx - d.x) * alpha;
	};
}
*/




