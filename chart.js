var parseDate = d3.timeParse("%m/%d/%Y");

var margin = {left: 50, right: 20, top: 20, bottom: 50 };


var max = 0;

var xNudge = 100;
var yNudge = 10;

var minDate = new Date();
var maxDate = new Date();

const yValue = d => d.date;
const titleValue = d => d.title;
const infoValue = d => d.info;
const urlValue = d => d.url;

const yScale = d3.scaleTime();



const yAxis = d3.axisLeft()
	.tickPadding(15)
	.tickFormat(d3.timeFormat("%B"))
	.tickSize(0);


var radius = "20.4px";


	
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

	var data = data;
	data.forEach(function(d) {
		d.date = parseDate(d.date);
	});
	minDate = d3.min(data, d => d.date);
	maxDate = d3.max(data, d => d.date);


	yScale
		.domain([maxDate.addMonths(.5), minDate])
		.range([0, 1000])
		.nice();

	yAxis.scale(yScale)
		.ticks(6);

	g.append("g")
		.attr("class","axis-y")
		.call(yAxis);

	//SVG
	var node = g.selectAll('.node')
		.data(data)
		.enter()
		.append("g")
		.attr("class", "node");
		
	node.append("svg:circle")
		.attr("class", "nodes")
		.attr("cx", 0)
		.attr("cy", d => yScale(d.date))
		.attr("r", radius)
		.attr("fill", "#3A3A3A")
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);
	/*
	node.append("text")
      .attr("dx", 12)
      .attr("dy", d => yScale(d.date))
      .attr("class", "node-label")
      .text(d => d.date.toString().slice(4,10));
	*/

	});
      // Create Event Handlers for mouse
      function handleMouseOver(d, i) {  // Add interactivity
            // Use D3 to select element, change color and size
            d3.select(".info-container").remove();
            d3.select("#instructions").remove();

            d3.selectAll("circle")
                .attr("fill", "#3A3A3A")


            d3.select(this)
            	.attr("fill", "#21AAD3")
            	.attr("r", radius);
            var info = d3.select("div#info")
					.append("div")
			.classed("info-container", true); //container class

			info.append("h1")
				.attr("class", "event-title")
	            .text(d.title);

            info.append("p")
            	.attr("class", "event-description")
            	.text(d.info);

            info.append("div")
            	.attr("class", "read-more-container")
	            .append("a")
            	.attr("xlink:href", d.url)
            	.attr("class", "button")
            //.html("<a href='" + d.url + "'> Read More </a> ");
        //    .attr("xlink:href", d.url)
          		.text('Read More \u2192 ');
//            .html('<h1> ${d.title} </h1> <p> {d.info}  </p> <a href=#> {d.url} </a>');
			
     
     }

     function handleMouseOut(d, i) {
     	// Use D3 to select element, change color back to normal
        d3.select(this)
        	//.attr("fill", "#3A3A3A")
        	//.attr("r", radius);

   
     }
Date.prototype.addMonths = function (m) {
    var d = new Date(this);
    var years = Math.floor(m / 12);
    var months = m - (years * 12);
    if (years) d.setFullYear(d.getFullYear() + years);
    if (months) d.setMonth(d.getMonth() + months);
    return d;
}
