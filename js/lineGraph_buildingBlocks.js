"use strict";

function resetToolTipPosition() {
    selectedData = filteredData_point[selectedYear]
    // set the input variables
    let year = selectedYear
    let pmdi = selectedData[pointInView]
    let selectedRollingAverageData = temporal_averageData[selectedYear]
    let selectedRegionalAverageData = spatial_averageData[selectedYear]
    // move tooltip with selected variables
    moveToolTip(year, pmdi, selectedRollingAverageData, selectedRegionalAverageData)
};


// Function to move tool tips to a given year
function moveToolTip(year, pmdi, rollingAverageData, regionalAverageData) {
    focusMain
        .attr("cx", x(year))
        .attr("cy", y(pmdi))
    focusRollingAverage
        .attr("cx", x(year))
        .attr("cy", y(rollingAverageData["average"]))
    focusRegionalAverage
        .attr("cx", x(year))
        .attr("cy", y(regionalAverageData["average"]))
    focusYearLine
        .attr("x1", x(year))
        .attr("x2", x(year))
        .attr("y1", y(8))
        .attr("y2", y(-8))
    // Set dynamic info contents
    setInfoPanelDynamicContents(year, pmdi, rollingAverageData, regionalAverageData)
}

//---------------------------------------------------------------

/* THESE FUNCTIONS SET NEW VISUALS ON THE LINEGRAPH */
// Set the x axis
function getXaxis() {
    let x = d3.scaleLinear()
        .domain([yearMin, yearMax])
        .range([0, width]);
    return x
}
// Set the y axis
function getYaxis() {
    let y = d3.scaleLinear()
        .domain([-8, 8])
        .range([height, 0]);
    return y
}
// add both axes based on those last two functions
function addAxes() {
    // Add X axis --> it is a date format
    xAxis
        .attr("class", "axisWhite")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    yAxis
        .attr("class", "axisWhite")
        .call(d3.axisLeft(y));
}
// Set the gradient
function addGradient() {
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

    // Set the gradient
    svgHolder.append("linearGradient")
        .attr("id", "strong-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", y(-6))
        .attr("x2", 0)
        .attr("y2", y(6))
        .selectAll("stop")
        .data([
            { offset: "30%", color: "#BD7F16" },
            { offset: "50%", color: "#ffffff" },
            { offset: "70%", color: "#2684B6" }
        ])
        .enter().append("stop")
        .attr("offset", function (d) { return d.offset; })
        .attr("stop-color", function (d) { return d.color; });
}
// Set the focuses
function setFocuses() {

    // Create the circle that travels along the curve of chart
    focusMain
        .style("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("z-index", 100)
        .attr('r', 6)
        .style("opacity", .8)

    // Create the circle that travels along the curve of chart
    focusRollingAverage
        .style("fill", "#FFF272")
        .attr("stroke", "#FFF272")
        .attr("stroke-width", 2)
        .attr("z-index", 100)
        .attr('r', 3)
        .style("opacity", 1)

    // Create the circle that travels along the curve of chart
    focusRegionalAverage
        .style("fill", "#9CDA97")
        .attr("stroke", "#9CDA97")
        .attr("stroke-width", 2)
        .attr("z-index", 100)
        .attr('r', 3)
        .style("opacity", 0)

    // Create the vertical line that travels along the curve of chart
    focusYearLine
        .attr("stroke", "white")
        .attr("stroke-width", strokeWidth)
        .attr("z-index", 0)
        .style("opacity", .5)

};
// Set the Reference Line (0 PMDI)
function setReferenceLine() {
    line_reference
        .style("fill", "rgb(50,50,50)")
        .attr("stroke", "rgb(50,50,50)")
        .attr("stroke-width", 1.5)
        .attr("z-index", -10)
        .style("opacity", 1)
        .attr("x1", x(yearMin))
        .attr("x2", x(yearMax))
        .attr("y1", y(0))
        .attr("y2", y(0))
}
// Set the Point Line
function setMainLine() {
    // Add the main line
    line_point
        .datum(filteredData_point)
        .attr("fill", "none")
        .attr("stroke", "url(#line-gradient)")
        .attr("stroke-width", strokeWidth)
        .attr("d", d3.line()
            .x(function (d) { return x(d.year) })
            .y(function (d) { return y(d[pointInView]) })
        )
};
// Set the Temporal Line
function setTemporalLine() {
    line_temporal
        .datum(temporal_averageData)
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr("d", d3.line()
            .x(function (d) { return x(d.year) })
            .y(function (d) { return y(d.average) })
        )
};
// Set the Regional Line
function setRegionalLine() {
    line_regional
        .datum(spatial_averageData)
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr("d", d3.line()
            .x(function (d) { return x(d.year) })
            .y(function (d) { return y(d.average) })
        )
};

// sets the linegraph title to match the years shown
function setLinegraphTitle() {

    //add formatted attribute to panel content string
    let titleContent = "<span class = 'smallText'>Summer PMDI </span><span class = 'timeText_dark'><b>" + yearMin + " - " + yearMax + "</b></span>";
    
    let titleDiv = d3.select("#graphLabel_title")
  
    titleDiv.html(titleContent)
  
    return;
  };

//---------------------------------------------------------------

function filterOutOfRegion(data) {

    // define local var of object to hold filterdData and they keys from input data
    let filteredData = {};
    let keys = Object.keys(data)

    // for each key in keys, check if it is in the keys array
    keys.forEach(function (key) {
        if (pointsInRegion.includes(parseInt(key))) {
            // if it is, append it to filteredData
            filteredData[key] = data[key]
        }
        return
    })

    return (filteredData)
}

function getPointsInRegion() {
    pointsInRegion = [];

    pointIndex.forEach(function (point) {
        let lat = point["latitude"]
        let lon = point["longitude"]
        if (lat >= latMin && lat <= latMax && lon >= lonMin && lon <= lonMax) {
            pointsInRegion.push(parseInt(point['index']))
        }
        return
    })
}