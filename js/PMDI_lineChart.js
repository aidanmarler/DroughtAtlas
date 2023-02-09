"use strict";

//Create variables that will be editable on the site
// Minimum Year and Max Year
let yearMin = 0;
let yearMax = 2017;
// Minimum Latitude and Longitude/ Maximum Latitude and Longitude
let latMin = 39;
let latMax = 40;
let lonMin = -100;
let lonMax = -70;
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

// when you click the rolling panel, call changeActiveAverageFunction(true)
document.getElementById("linegraph_infoPanel_rolling").addEventListener("click", function () { changeActiveAverageFunction(true) });
// when you click the regional panel, call changeActiveAverageFunction(false)
document.getElementById("linegraph_infoPanel_region").addEventListener("click", function () { changeActiveAverageFunction(false) });

function changeActiveAverageFunction(rollingSelected) {
  const rolling = document.getElementById("linegraph_infoPanel_rolling");
  const regional = document.getElementById("linegraph_infoPanel_region");
  const light = "rgb(150, 150, 150)"
  const dark = "rgb(20,20,20)"
  let temporal_color
  let temporal_opacity
  let temporal_focus_opacity
  let regional_color
  let regional_opacity
  let regional_focus_opacity

  if (rollingSelected) {
    // ROLLING ACTIVE
    temporal_color = "white"
    temporal_opacity = .7
    temporal_focus_opacity = .9
    rolling.style.backgroundColor = "white"
    rolling.style.color = "black"
    // REGIONAL NOT ACTIVE
    regional_color = "white"
    regional_opacity = .1
    regional_focus_opacity = 0
    regional.style.backgroundColor = dark
    regional.style.color = light
  } else {
    // ROLLING ACTIVE
    temporal_color = "white"
    temporal_opacity = 0
    temporal_focus_opacity = 0
    rolling.style.backgroundColor = dark
    rolling.style.color = light
    // REGIONAL ACTIVE
    regional_color = "white"
    regional_opacity = .7
    regional_focus_opacity = 1
    regional.style.backgroundColor = "white"
    regional.style.color = "black"
  }

  // set temporal colors
  line_temporal
    .attr("stroke", temporal_color)
    .attr("stroke-opacity", temporal_opacity)
  focusRollingAverage
    .style("opacity", temporal_focus_opacity)
  // set regional colors
  line_regional
    .attr("stroke", regional_color)
    .attr("stroke-opacity", regional_opacity)
  focusRegionalAverage
    .style("opacity", regional_focus_opacity)


  addEventListener('mouseover', (event) => { });

}

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
  let titleContents = "<span class = 'timeText_dark bigText'><b>" + year + "</span></b><span class = 'timeText_dark'> CE</span>"
  if (pmdi == "") {
    pmdi = "N/A"
  }
  titleContents += "<br/>PMDI: <b><span class = 'bigText'>" + pmdi + "</b></span>"
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






let rollingLineColor = "white"
let regionalLineColor = "grey"
let rollingLineOpacity = .5
let regionalLineOpacity = .2
let rollingFocusOpacity = .8
let regionalFocusOpacity = 0

//---------------------------------------------------------------



