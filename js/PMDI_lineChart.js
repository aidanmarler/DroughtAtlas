"use strict";

//Create variables that will be editable on the site
// Minimum Year and Max Year
let yearMin = 0;
let yearMax = 2017;
// Minimum Latitude and Longitude/ Maximum Latitude and Longitude
let latMin = 25.01;
let latMax = 50.01;
let lonMin = -125.01;
let lonMax = -66.01;
// Point Selected to view the data of
let pointInView = "2274";
// the selected points latitiude and longitude
let pointInView_lat = 42.75;
let pointInView_lon = -98.25;
// Years to use to collect an average around each point
let averageRange = 101;
// a global array to store data for the averages in
let temporal_averageData = [];
let spatial_averageData = [];
//---------------------------------------------------------------

// get data--funcitons are called by "main"

//Creat Variables to hold the datasets
let lbda_csv;
let pointIndex;


// READ ME: this is all d3 v4.  v5 is promise based.  download v5, save as d3v5, and make these functions with that instead
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

//---------------------------------------------------------------

// Create Panel and define margin widths

// set the dimensions and margins of the graph
var margin = { top: 30, right: 15, bottom: 60, left: 50 },
  width = $("#linegraph_graphPanel").width() - margin.left - margin.right,
  height = $("#linegraph_graphPanel").height() - margin.top - margin.bottom;


// everything in this is the actual linegraph
// append the svg object to the body of the page
var svgHolder = d3.select("#linegraph_graphPanel")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + ((margin.left) - (0)) + "," + margin.top + ")");

//---------------------------------------------------------------

// Functions to get new point or new time range

// On click a new point, find lat and long in the pointIndex CSV and set new pointInView from index value
function setPointInView(lat, lon) {
  // itterate through the pointIndex csv; save the index of the point that matches
  for (let i = 0; i < pointIndex.length; i++) {
    if ((lat == pointIndex[i]["latitude"]) && (lon == pointIndex[i]["longitude"])) {
      // using the points lat and long, get the point in view and save it
      pointInView = (pointIndex[i]["index"])
      // save the lat and lon to be displayed 
      pointInView_lat = lat
      pointInView_lon = lon
      return
    }
    //return
  }
}

// On input a new year, figure out if valid then call to create a new chart
function inputYearRange() {
  // Store the inputs into variables
  var inputMin = parseInt(document.getElementById("yearMinInput").value);
  var inputMax = parseInt(document.getElementById("yearMaxInput").value);
  // Fail if string is max is less than mino
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

// Set New Line Graph on events

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

// sets the linegraph title to match the years shown
function setLinegraphTitle() {

  //add formatted attribute to panel content string
  let titleContent = "<span class = 'smallText'>Summer PMDI </span><span class = 'timeText_dark'><b>" + yearMin + " - " + yearMax + "</b></span>";
  
  let titleDiv = d3.select("#graphLabel_title")

  titleDiv.html(titleContent)

  return;
};
//---------------------------------------------------------------

// 

// Creates and sets the contents of the dynamic panel by the linegraph
// what makes it dynamic, as opposed to static, is the fact that it gets updtated based on mouse movement
function setInfoPanelDynamicContents(year, pmdi, rollingData, rollingSelected) {
  // change title conents
  setInfoPanelTitleContents(year, pmdi);
  // change rolling contents
  setInfoPanelRollingContents(rollingData, true);
  // change regional contents
  setInfoPanelRegionalContents(rollingData, true);
}

// Sets the title Contents for the linegraph stats panel.
function setInfoPanelTitleContents(year, pmdi) {
  // get and save te html id as variable
  const linegraph_infoPanel_title = document.getElementById("linegraph_infoPanel_title");
  // Create HTML contents of the panel
  let titleContents = "<span class = 'timeText_dark'><b><font size='+0'>" + year + "</b></font> CE</span>"
  if (pmdi == "") {
    pmdi = "N/A"
  }
  titleContents += "<br/>PMDI: <b><font size='+0'>" + pmdi + "</font></b>"
  // Assign contents to the saved panel
  linegraph_infoPanel_title.innerHTML = titleContents;
}

function setInfoPanelRollingContents(rollingData, rollingSelected) {
  // Get and save the panels to interact with.
  const linegraph_infoPanel_rolling = document.getElementById("linegraph_infoPanel_rolling");
  const linegraph_infoPanel_rolling_title = document.getElementById("linegraph_infoPanel_rolling_title");
  const linegraph_infoPanel_rolling_labels = document.getElementById("linegraph_infoPanel_rolling_labels");
  const linegraph_infoPanel_rolling_values = document.getElementById("linegraph_infoPanel_rolling_values");

  let rollingAverage = Math.round((rollingData["average"] + Number.EPSILON) * 100) / 100
  if (rollingData["average"] == 0) {
    rollingAverage = "N/A"
  }

  let rollingSD = Math.round((rollingData["sd"] + Number.EPSILON) * 100) / 100
  if (rollingData["sd"] == 0) {
    rollingSD = "N/A"
  }

  let rollingCount = rollingData["yearsUsed"]
  if (rollingData["yearsUsed"] == undefined) {
    rollingCount = "N/A"
  }

  let shade = "dark"
  if (rollingSelected) {
    shade = "light"
  }

  let labelContents = "Lat:<br/>"
  labelContents += "Lon:<br/>"

  labelContents += averageRange + " y. x̄:<br/>"
  labelContents += averageRange + " y. s:<br/>"
  labelContents += "Count:<br/>"

  let valuesContents = "<b>" + pointInView_lat + "</b><br/>"
  valuesContents += "<b>" + pointInView_lon + "</b><br/>"
  valuesContents += "<b>" + rollingAverage + "</b><br/>"
  valuesContents += "<b>" + rollingSD + "</b><br/>"
  valuesContents += "<b>" + rollingCount + "</b>"

  linegraph_infoPanel_rolling_labels.innerHTML = labelContents;
  linegraph_infoPanel_rolling_values.innerHTML = valuesContents;
}

function setInfoPanelRegionalContents(regionData, rollingSelected) {
  // Get and save the panels to interact with.
  const linegraph_infoPanel_region = document.getElementById("linegraph_infoPanel_region");
  const linegraph_infoPanel_region_title = document.getElementById("linegraph_infoPanel_region_title");
  const linegraph_infoPanel_region_labels = document.getElementById("linegraph_infoPanel_region_labels");
  const linegraph_infoPanel_region_values = document.getElementById("linegraph_infoPanel_region_values");

  /*
  let rollingAverage = Math.round((regionData["average"] + Number.EPSILON) * 100) / 100
  if (regionData["average"] == 0) {
    rollingAverage = "N/A"
  }

  let rollingSD = Math.round((regionData["sd"] + Number.EPSILON) * 100) / 100
  if (regionData["sd"] == 0) {
    rollingSD = "N/A"
  }

  let rollingCount = regionData["pointsUsed"]
  if (regionData["pointsUsed"] == undefined) {
    rollingCount = "N/A"
  }

  let shade = "dark"
  if (rollingSelected) {
    shade = "light"
  }
  */

  let titleContents = "Lat: <b>" + latMin + "</b> to <b>"
  titleContents += latMax + "</b><br/>"
  titleContents += "Lon: <b>" + lonMin + "</b> to <b>"
  titleContents += lonMax + "</b><br/>"

  /*
  let labelContents = "y. x̄:<br/>"
  labelContents += " y. s:<br/>"
  labelContents += "Count:<br/>"

  let valuesContents = "<b>" + pointInView_lat + "</b><br/>"
  valuesContents += "<b>" + pointInView_lon + "</b><br/>"
  valuesContents += "<b>" + rollingAverage + "</b><br/>"
  valuesContents += "<b>" + rollingSD + "</b><br/>"
  valuesContents += "<b>" + rollingCount + "</b>" */

  linegraph_infoPanel_region_title.innerHTML = titleContents;
}

document.getElementById("linegraph_infoPanel_rolling").addEventListener("click", function () { changeActiveAverageFunction(true) });
document.getElementById("linegraph_infoPanel_region").addEventListener("click", function () { changeActiveAverageFunction(false) });

function changeActiveAverageFunction(rollingSelected) {
  const rolling = document.getElementById("linegraph_infoPanel_rolling");
  const regional = document.getElementById("linegraph_infoPanel_region");
  const light = "rgb(150, 150, 150)"
  const dark = "rgb(20,20,20)"


  if (rollingSelected) {
    // selected
    rolling.style.backgroundColor = "white"
    rolling.style.color = "black"
    rollingLineColor = "white"
    rollingLineOpacity = .5
    rollingFocusOpacity = .9
    // not selected
    regional.style.backgroundColor = dark
    regional.style.color = light
    regionalLineColor = "grey"
    regionalLineOpacity = .2
    regionalFocusOpacity = 0
  } else {
    // not selected
    rolling.style.backgroundColor = dark
    rolling.style.color = light
    rollingLineColor = "grey"
    rollingLineOpacity = .2
    rollingFocusOpacity = 0
    // selected
    regional.style.backgroundColor = "white"
    regional.style.color = "black"
    regionalLineColor = "white"
    regionalLineOpacity = .6
    regionalFocusOpacity = .9
  }
  svgHolder.html("");
  buildLineChart(lbda_csv)
};


let rollingLineColor = "white"
let regionalLineColor = "grey"
let rollingLineOpacity = .5
let regionalLineOpacity = .2
let rollingFocusOpacity = .8
let regionalFocusOpacity = 0

//---------------------------------------------------------------



