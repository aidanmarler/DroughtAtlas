"use strict";

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

function getXaxis() {
    let x = d3.scaleLinear()
        .domain([yearMin, yearMax])
        .range([0, width]);
    return x
}

function getYaxis() {
    let y = d3.scaleLinear()
        .domain([-8, 8])
        .range([height, 0]);
    return y
}

function setAxesAndGradient() {
    // Add X axis --> it is a date format
    svgHolder.append("g")
        .attr("class", "axisWhite")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    svgHolder.append("g")
        .attr("class", "axisWhite")
        .call(d3.axisLeft(y));

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
}

function setLinesAndFocuses(strokeWidth) {
    svgHolder
        .append('g')
        .append('line')
        .style("fill", "rgb(50,50,50)")
        .attr("stroke", "rgb(50,50,50)")
        .attr("stroke-width", 1.5)
        .attr("z-index", -10)
        .style("opacity", 1)
        .attr("x1", x(yearMin))
        .attr("x2", x(yearMax))
        .attr("y1", y(0))
        .attr("y2", y(0))
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

    // Add the regional average line
    svgHolder
        .append("path")
        .datum(spatial_averageData)
        .attr("fill", "none")
        .attr("stroke", regionalLineColor)
        .attr("stroke-opacity", regionalLineOpacity)
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(function (d) { return x(d.year) })
            .y(function (d) { return y(d.average) })
        )

    // Add the temporal average line
    svgHolder
        .append("path")
        .datum(temporal_averageData)
        .attr("fill", "none")
        .attr("stroke", rollingLineColor)
        .attr("stroke-opacity", rollingLineOpacity)
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(function (d) { return x(d.year) })
            .y(function (d) { return y(d.average) })
        )


    // Create the circle that travels along the curve of chart
    focusMain = svgHolder
        .append('g')
        .append('circle')
        .style("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("z-index", 100)
        .attr('r', 6)
        .style("opacity", .8)

    // Create the circle that travels along the curve of chart
    focusRollingAverage = svgHolder
        .append('g')
        .append('circle')
        .style("fill", "#FFF272")
        .attr("stroke", "#FFF272")
        .attr("stroke-width", 2)
        .attr("z-index", 100)
        .attr('r', 3)
        .style("opacity", rollingFocusOpacity)

    // Create the circle that travels along the curve of chart
    focusRegionalAverage = svgHolder
        .append('g')
        .append('circle')
        .style("fill", "#9CDA97")
        .attr("stroke", "#9CDA97")
        .attr("stroke-width", 2)
        .attr("z-index", 100)
        .attr('r', 3)
        .style("opacity", regionalFocusOpacity)

    // Create the vertical line that travels along the curve of chart
    focusYearLine = svgHolder
        .append('g')
        .append('line')
        .attr("stroke", "white")
        .attr("stroke-width", strokeWidth)
        .attr("z-index", 0)
        .style("opacity", .5)

};