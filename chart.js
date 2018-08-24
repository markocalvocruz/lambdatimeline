var parseDate = d3.timeParse("%m/%d/%Y");
var xNudge = 160;
var yNudge = 10;

/*COLORS START */
var unselectedColor = "#3A3A3A";
var selectedColor = "#21AAD3";
/*COLORS END */

/* CSV VALUES START */
const dateValue = d => d.date;
const titleValue = d => d.title;
const infoValue = d => d.info;
const urlValue = d => d.url;
/* CSV VALUES END */


const yScale = d3.scaleTime();
const yAxis = d3.axisLeft()
	.tickPadding(50)
	.tickFormat(d3.timeFormat("%B"))
	.tickSize(0);


var radius = "20px";


	
var svg = d3.select("div#chart")
			.append("div")
			.classed("svg-container", true) //container class					 
			.append("svg")
			//responsive SVG needs these 2 attributes and no width and height attr
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", "0 0 200 1000")
			//class to make it responsive
 		    .classed("svg-content-responsive", true); 

var g = svg.append("g")
			.attr("class","chartGroup")
			.attr("transform","translate("+xNudge+","+yNudge+")");


d3.csv("Lambda.csv").then(function(data) {

	//Process Dates
	data.forEach(function(d) {
		d.date = parseDate(dateValue(d));
	});

	/* AXIS START */

	//DOMAIN FOR DATE-AXIS 
	var minDate = d3.min(data, d => dateValue(d));
	var maxDate = d3.max(data, d => dateValue(d));

	yScale //Vertical Timeline
		.domain([maxDate.addMonths(.5), minDate])
		.range([0, 1000])
		.nice();

	yAxis.scale(yScale)
		.ticks(6); //revisit: arbitrary number 

	g.append("g")
		.attr("class","axis-y")
		.call(yAxis);

	/*AXIS END */

	/* PLOTTING START */

	var node = g.selectAll('.node')
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
	    .nodes(nodes)
	    .size([width, height])
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

    d3.selectAll("circle")
      	.attr("fill", unselectedColor);


    d3.select(this)
    	.attr("fill", selectedColor)
    	.attr("r", radius);
    var info = d3.select("div#info")
			.append("div")
	.classed("info-container", true); //container class

	//Event Date
	info.append("div")
		.attr("class", "center-align-container")
		.append("span")
		.attr("class", "event-date")
        .text(d.date.toString().slice(4,10));

    //Event Title
	info.append("div")
		.attr("class", "center-align-container")
		.append("h1")
		.attr("class", "event-title")
        .text(d.title);

    //Event Description
    info.append("p")
    	.attr("class", "event-description")
    	.text(d.info);

    //Event Read More Button
    info.append("div")
    	.attr("class", "center-align-container")
        .append("a")
        .attr("class", "my-3")
    	.attr("xlink:href", d.url)
    	.attr("class", "read-more-button")
    	.text('Read More \u2192 ');
    info.append("div")
    	.attr("class", "center-align-container")
    	.append("p")
    	.attr("class", "my-4")
    	.text("Caution: Button Defective")

    //.html("<a href='" + d.url + "'> Read More </a> ");
//    .attr("xlink:href", d.url)
//            .html('<h1> ${d.title} </h1> <p> {d.info}  </p> <a href=#> {d.url} </a>');
	

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
//Date function ends


/*	
	SOMEHOW RELATED TO COLLISION DETECION 
	SOURCE: http://bl.ocks.org/fabiovalse/bf9c070d0fa6bab79d6a
*/

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
