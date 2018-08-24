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
	.scale(yScale)
	.tickPadding(15);

var radius = "8px";


	
var svg = d3.select("div#chart")
			.append("div")
			.classed("svg-container", true) //container class					 
			.append("svg")
			//responsive SVG needs these 2 attributes and no width and height attr
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", "0 0 500 1000")
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
		.domain([minDate, maxDate])
		.range([0, 800])
		.nice()
	yAxis.scale(yScale)
	console.log(yScale(data[0].date))
	//SVG
	g.selectAll('.dot')
		.data(data)
		.enter()
		.append("svg:circle")
		.attr("class", "nodes")
		.attr("cx", 0)
		.attr("cy", d => yScale(d.date))
		.attr("r", radius)
		.attr("fill", "black")
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);

	g.append("g")
	.attr("class","axis y")
	.call(yAxis);


	});
      // Create Event Handlers for mouse
      function handleMouseOver(d, i) {  // Add interactivity
            // Use D3 to select element, change color and size
            d3.select(".info-container").remove();

            d3.select(this)
            	.attr("fill", "red")
            	.attr("r", "4px");
            var info = d3.select("div#info")
					.append("div")
			.classed("info-container", true); //container class

			info.append("h1")
				.attr("class", "event-title")
	            .text(d.title + " " + d.date.toLocaleDateString());

            info.append("p")
            .text(d.info);

            info.append("a")
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
        	.attr("fill", "black")
        	.attr("r", radius);

   
     }
