var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our scatter plot, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartgroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import data 
d3.csv("data.csv", function(err, povertyobesity) {
  if (err) throw err;
 
  // console.log(healthdata);

 // Step 1: Parse Data/Cast as numbers
    povertyobesity.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity= +data.obesity;  
        });

// Step 2: Create scale functions
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(povertyobesity, data => data.poverty)-0.5, d3.max(povertyobesity, data => data.poverty)+0.5, 30])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(povertyobesity, data => data.obesity)-1, d3.max(povertyobesity, data => data.obesity)+1.1])
    .range([height, 0]);
  
// Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

//Append axes to the chart
    chartgroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartgroup
    .append("g")
    .call(leftAxis);

//Create Circles
    var circlesGroup = chartgroup.selectAll("circle").data(povertyobesity).enter();
  
    var cTip=circlesGroup
    .append("circle")  
    .classed("stateCircle", true)
    .attr("cx", data => xLinearScale(data.poverty))
    .attr("cy", data => yLinearScale(data.obesity))
    .attr("r", "15")
    .attr("opacity", ".5");
  
//Create text labels with state abbreviation for each circle
    circlesGroup.append("text")
    .classed("stateText", true)
    .attr("x", data => xLinearScale(data.poverty))
    .attr("y", data => yLinearScale(data.obesity))
    .attr("stroke", "teal")
    .attr("font-size", "10px")
    .text(data => data.abbr)
    
  
//Initialize tool tip

    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(data) {
      return (`${data.state}<br>Poverty: ${data.poverty}%<br>Obese: ${data.obesity}%`);
    });

//Create tooltip in the chart
    cTip.call(toolTip);

//Create event listeners to display and hide the tooltip
    cTip.on("mouseover", function(data) {
        d3.select(this).style("stroke", "black")
        toolTip.show(data, this);
    })
  //on mouseout event
    .on("mouseout", function(data, index) {
        d3.select(this).style("stroke", "blue")
        .attr("r", "10")
        toolTip.show(data);
    });


// Create Y-axis and X-axis labels
    chartgroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height/1.4))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% of Population that is Obese");

    chartgroup
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("% of Population in Poverty");
    
});