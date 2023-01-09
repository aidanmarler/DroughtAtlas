//Create variables that will be editable on the site
// Minimum Year and Max Year
let yearMin = 0;
let yearMax = 2017;
// Minimum Latitude and Longitude/ Maximum Latitude and Longitude
let latMin = 100;
let latMax = 100;
// Point Selected to view the data of
let pointInView = "2274";
// Years to use to collect an average around each point
let averageRange = 101;
// a global array to store data for the average in
let averageData = [];
//---------------------------------------------------------------

// MAIN: get data, build initial linechart

//Creat Variables to hold the datasets
let lbda_csv;
let pointIndex;

// Store PMDI csv
function getLBDA() {
  d3.csv("data/LBDA_main.csv", function (data) {
    lbda_csv = data
  })
}
// Store pointIndex
function getPointIndex() {
  d3.csv("data/LBDA_pointIndex.csv", function (data) {
    pointIndex = data
  })
}
// Call these funtions, wait, and then build line chart when done
getLBDA()
getPointIndex()
setTimeout(() => buildLineChart(lbda_csv), 300);
//---------------------------------------------------------------

// Functions to get new point or new time range

// On click a new point, find lat and long in the pointIndex CSV and set new pointInView from index value
function setPointInView(lat, lon) {
  for (let i = 0; i < pointIndex.length; i++) {
    if ((lat == pointIndex[i]["latitude"]) && (lon == pointIndex[i]["longitude"])) {
      pointInView = (pointIndex[i]["index"])
      //console.log(pointInView)
      return
    }
  }
}

// On input a new year, figure out if valid then call to create a new chart
function inputYearRange() {
  // Store the inputs into variables
  var inputMin = parseInt(document.getElementById("yearMinInput").value);
  var inputMax = parseInt(document.getElementById("yearMaxInput").value);
  // Fail if string is max is less than min
  if (inputMin >= inputMax) {
    alert("Minimum year must be less than Maximum year.")
    return
  }
  // Succeed if in range
  if (((inputMin <= 2017) && (inputMin >= 0) && (inputMax <= 2017) && (inputMax >= 0))) {
    document.getElementById("yearMinInput").value = ""
    document.getElementById("yearMaxInput").value = ""
    callNewChartTimeRange(inputMin, inputMax);
    return
  }
  // Otherwise, fail
  alert("Not in range 0-2017")
  return
}

// On input a new year, figure out if valid then call to create a new chart
function inputAveragingRange() {
  // Store the inputs into variables
  var input = parseInt(document.getElementById("averagingRangeInput").value);
  // Fail if string is max is less than min
  if (input < 0) {
    alert("Input must be positive.")
    return
  }
  // Fail if string is max is less than min
  if (input % 2 == 0) {
    alert("Input must be an odd number \n\n (ie: 5 would average the year in question with the two years before and after it)")
    return
  }
  // Succeed if in range
  if (((input < 10000))) {
    document.getElementById("averagingRangeInput").value = ""
    callNewChartRollingAverage(input);
    return
  }
  // Otherwise, fail
  alert("Input must be a number.")
  return
}
//---------------------------------------------------------------

// Create Panel and define margin widths

// set the dimensions and margins of the graph
var margin = { top: 30, right: 20, bottom: 50, left: 250 },
  width = 1245 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;


// append the svg object to the body of the page
var svgHolder = d3.select("#linegraph_mainPanel")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


//---------------------------------------------------------------

// Set New Line Graph

// set new point to graph
function callNewChartPoint(lat, lon) {
  // Select the container element for the graph
  // Remove the existing svg element
  svgHolder.html("");
  setPointInView(lat, lon);
  buildLineChart(lbda_csv);
}

// set new range of years to graph
function callNewChartTimeRange(min, max) {
  // Select the container element for the graph
  // Remove the existing svg element
  svgHolder.html("");
  yearMin = min;
  yearMax = max;
  buildLineChart(lbda_csv);
}

// set new range of years to graph
function callNewChartRollingAverage(average) {
  // Select the container element for the graph
  // Remove the existing svg element
  svgHolder.html("");
  averageRange = average;
  buildLineChart(lbda_csv);
}
//---------------------------------------------------------------

// Calculate AVERAGE PMDI over X years

// Calculate Average of an array of points given 
function calculateYearlyAverage(year, range) {
  // Define local variables
  let averageValue = 0;
  let averageList = [];
  let rangeToAverage = Math.floor(range / 2);

  // add point to average around to list of points to average
  averageList.push(parseFloat(lbda_csv[year][pointInView]))

  // For each number between 1 and rangeToAverage, get cellValue and add it to list if it is actually a number
  for (let i = 1; i <= rangeToAverage; i++) {
    // Define a variable to get the value at each surrounding cell
    let cellValue;

    // check if year is in range
    if ((year + i) <= 2017) {

      cellValue = lbda_csv[(year + i)][pointInView]
      if (cellValue != '') {
        averageList.push(parseFloat(cellValue))
      };
    };

    // check if year is in range
    if ((year - i) >= 0) {
      cellValue = lbda_csv[(year - i)][pointInView]
      if (cellValue != '') {
        averageList.push(parseFloat(cellValue))
      };
    };
  };

  averageList.forEach((value) => {
    averageValue += value;
  })

  averageValue = averageValue / averageList.length;
  //console.log(year, averageList)

  return [averageValue, averageList.length];
}

// Calculate the Average for every year in the dataframe.
function createAverageDatum(data) {
  //data[year][pointID]
  //console.log(data[2017][2274])
  // for year in range, get data[year][pointID], calc avg for that point, and then add it to a datum

  averageData = [];

  // Loop through each row (year) of the data
  data.forEach(function (d) {

    if ((d[pointInView]) == "") {
      var yearMean = ["", 0];
    } else {
      var yearMean = calculateYearlyAverage(parseInt(d.year), averageRange);
    };

    // Add the mean to the newData array
    averageData.push({
      year: d.year,
      average: yearMean[0],
      yearsUsed: yearMean[1]
    });
  });
};

//---------------------------------------------------------------

// 

// append the svg object to the body of the page
const infoPanel_static = document.getElementById("linegraph_infoPanel_static");
const infoPanel_dynamic = document.getElementById("linegraph_infoPanel_dynamic");
let sideColumn = document.createElement("div")
infoPanel_dynamic.append(sideColumn)
sideColumn.style = "text-align:right;"

function setInfoPanelStaticContents() {
  var contents = "<br/> Point: " + pointIndex[parseFloat(pointInView)]["latitude"] + ", " + pointIndex[parseFloat(pointInView)]["longitude"]
  contents += "<br/><br/> Time Range: " + yearMin + " - " + yearMax
  infoPanel_static.innerHTML = contents;
}

function setInfoPanelDynamicContents(year, pmdi, mean) {
  var average = Math.round((mean + Number.EPSILON) * 100) / 100
  var contents = "<br/> Year: " +   "<font size='+0'>" + year + "</font>"
  contents += "<br/><br/> PMDI: " + "<font size='+0'>" + pmdi + "</font>"
  contents += "<br/><br/> " + averageRange + " year rolling average: " + "<font size='+0'>" + average + "</font>"
  infoPanel_dynamic.innerHTML = contents;
  sideColumn.innerHTML = "hello world"
}


//---------------------------------------------------------------

// FINAL Build the line chart, call all necessary functions

//Read the PMDI data
//d3.csv("data/LBDA_main.csv", function (data) {
function buildLineChart(data) {
  //console.log(lbda_csv[1000][2274])
  // Filter the data to only show values from the range of years chosen
  var filteredData = data.filter(function (data) {

    if ((data["year"] >= yearMin) && (data["year"] <= yearMax)) {
      return data;
    }
  })

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain([yearMin, yearMax])
    .range([0, width]);
  svgHolder.append("g")
    .attr("class", "axisWhite")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-8, 8])
    .range([height, 0]);
  svgHolder.append("g")
    .attr("class", "axisWhite")
    .call(d3.axisLeft(y));

  // This allows to find the closest X index of the mouse:
  var bisect = d3.bisector(function (d) { return d.year; }).left;

  // Set the gradient
  svgHolder.append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", y(-6))
    .attr("x2", 0)
    .attr("y2", y(6))
    .selectAll("stop")
    .data([
      { offset: "0%", color: "#BD7F16" },
      { offset: "50%", color: "#b3b3b3" },
      { offset: "100%", color: "#2684B6" }
    ])
    .enter().append("stop")
    .attr("offset", function (d) { return d.offset; })
    .attr("stop-color", function (d) { return d.color; });


  // Determine main line stroke width depending on how many years are in view
  var strokeWidth = ((100 / ((yearMax - yearMin))) + .5)
  //console.log(strokeWidth)

  // Create datum of X year average values from LBDA_csv
  createAverageDatum(filteredData)

  // Add the main line
  svgHolder
    .append("path")
    .datum(filteredData)
    .attr("fill", "none")
    .attr("stroke", "url(#line-gradient)")
    .attr("stroke-width", strokeWidth)
    .attr("d", d3.line()
      .x(function (d) { return x(d.year) })
      .y(function (d) { return y(d[pointInView]) })
    )


  // Add the other line (yearly average)
  svgHolder
    .append("path")
    .datum(averageData)
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-opacity", .5)
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .x(function (d) { return x(d.year) })
      .y(function (d) { return y(d.average) })
    )


  // Create the circle that travels along the curve of chart
  var focusMain = svgHolder
    .append('g')
    .append('circle')
    .style("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("z-index", 100)
    .attr('r', 6)
    .style("opacity", 0)

  // Create the circle that travels along the curve of chart
  var focusTempAverage = svgHolder
    .append('g')
    .append('circle')
    .style("fill", "white")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("z-index", 100)
    .attr('r', 3)
    .style("opacity", 0)

  // Create the circle that travels along the curve of chart
  var focusYearLine = svgHolder
    .append('g')
    .append('line')
    .attr("stroke", "white")
    .attr("stroke-width", strokeWidth)
    .attr("z-index", 0)
    //.attr('r', 6)
    .style("opacity", 0)

  // Create the text that travels along the curve of chart
  var focusText = svgHolder
    .append('g')
    .append('text')
    //.append('rectangle')
    .style("opacity", 0)
    .style("fill", "white")
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")

  // Create a rect on top of the svg area: this rectangle recovers mouse position
  svgHolder
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout)
    .on('click', click);


  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
    focusMain.style("opacity", .9)
    focusTempAverage.style("opacity", .9)
    focusText.style("opacity", 0)
    focusYearLine.style("opacity", .5)
  }

  // Calculate where to put the popup
  function calcPopupXPos(x) {
    return (-100 * (x / width)) + 15
  }

  // When the mouse is moved over the visualization, activate the popup 
  function mousemove() {
    // recover coordinate we need
    var x0 = x.invert(d3.mouse(this)[0]);
    var mainTracer = bisect(filteredData, x0, 1);
    var temporalAverageTracer = bisect(averageData, x0, 1);
    selectedData = filteredData[mainTracer]
    selectedAverageData = averageData[temporalAverageTracer]
    //console.log(selectedAverageData["average"])
    xPos = calcPopupXPos(x(selectedData.year))
    focusMain
      .attr("cx", x(selectedData.year))
      .attr("cy", y(selectedData[pointInView]))
    focusTempAverage
      .attr("cx", x(selectedData.year))
      .attr("cy", y(selectedAverageData["average"]))
    focusYearLine
      .attr("x1", x(selectedData.year))
      .attr("x2", x(selectedData.year))
      .attr("y1", y(8))
      .attr("y2", y(-8))
    focusText
      .html("x:" + selectedData.year + "  -  " + "y:" + selectedData[pointInView])
      .attr("x", x(selectedData.year) + xPos)
      .attr("y", y(selectedData[pointInView]) - 14)
    // Set dynamic info contents
    setInfoPanelDynamicContents(selectedData.year, selectedData[pointInView], selectedAverageData["average"])
  }

  // When mouse leaves the visualization, remove the popup
  function mouseout() {
    // Set popup circle and text opacity to 0
    focusMain.style("opacity", 0)
    focusTempAverage.style("opacity", 0)
    focusYearLine.style("opacity", 0)
    focusText.style("opacity", 0)
  }

  function click(){
    lineGraphNewYear(selectedData.year)
    console.log(selectedData.year)
  }

  setInfoPanelStaticContents()

}