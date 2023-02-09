let x;
let y;
let filteredData_point;
let filteredData_region;
let selectedData;
let pointsInRegion;
let strokeWidth;


//---------------------------------------------------------------

// Create Panel and define margin widths

// set the dimensions and margins of the graph
let margin = { top: 30, right: 15, bottom: 60, left: 50 },
    width = $("#linegraph_graphPanel").width() - margin.left - margin.right,
    height = $("#linegraph_graphPanel").height() - margin.top - margin.bottom;


// everything in this is the actual linegraph
// append the svg object to the body of the page
let svgHolder = d3.select("#linegraph_graphPanel")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + ((margin.left) - (0)) + "," + margin.top + ")");

let line_reference = svgHolder.append("line")
let line_point = svgHolder.append("path")
let line_regional = svgHolder.append("path")
let line_temporal = svgHolder.append("path")
let focusMain = svgHolder.append("circle");
let focusRollingAverage = svgHolder.append("circle");
let focusRegionalAverage = svgHolder.append("circle");
let focusYearLine = svgHolder.append("line");
let xAxis = svgHolder.append("g");
let yAxis = svgHolder.append("g");


//---------------------------------------------------------------

// Call when selecting a new point
function callNewChartPoint(lat, lon) {
    // Select the container element for the graph
    // Remove the existing svg element
    setPointInView(lat, lon);   // set a new point
    setMainLine();              // redraw main line
    // recreate the temporal datum, and then redraw it
    createTemporalAverageDatum(filteredData_point).then(() => {
        setTemporalLine();
    });
    // finally reset tool tip
    resetToolTipPosition();
}

// set new range of years to graph
function callNewChartRollingAverage(average) {
    // Select the container element for the graph
    // Remove the existing svg element
    averageRange = average;
    // recreate the temporal datum, and then redraw it
    createTemporalAverageDatum(filteredData_point).then(() => {
        setTemporalLine();
    });
    // finally reset tool tip
    resetToolTipPosition();
}

// Call when selecting a new timerange
function callNewChartTimeRange(min, max) {
    // Select the container element for the graph
    // Remove the existing svg element
    //svgHolder.html("");
    yearMin = min;
    yearMax = max;
    buildLineChart(lbda_csv);
}

// Rebuilds the whole svg linechart.
function buildLineChart(data) {


    //----- DEFINE LOCAL FUNCTIONS -----

    // Create a rect on top of the svg area: this rectangle recovers mouse position
    function addInteractionRectangle() {
        svgHolder
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout)
            .on('mousedown', dragStart)
            .on('mouseup', dragEnd);
    }

    // Define the interaction functions
    // interaction: On Mouse Over the graph, set the cursor to a pointer
    function mouseover() {
        svgHolder
            .style("cursor", "pointer")
    }

    // interaction: When the mouse is moved over the visualization, activate the popup 
    function mousemove() {
        // recover coordinate we need
        var x0 = x.invert(d3.mouse(this)[0]);
        var tracer = bisect(filteredData_point, x0, 0);
        var tracer2 = bisect(filteredData_region, x0, 0);
        selectedData = filteredData_point[tracer]
        // set the input variables
        let year = selectedData.year
        let pmdi = selectedData[pointInView]
        let selectedRollingAverageData = temporal_averageData[tracer]
        let selectedRegionalAverageData = spatial_averageData[tracer2]
        // move tooltip with selected variables
        moveToolTip(year, pmdi, selectedRollingAverageData, selectedRegionalAverageData)
    }

    // interaction: When mouse leaves the visualization, remove the popup
    function mouseout() {
        resetToolTipPosition();
    }

    // interaction: starts the click/hold interaction with a timer and sets interaction variables
    function dragStart() {
        interactionIsClick = true;
        dragStartYear = selectedData.year;
        setTimeout(() => (interactionIsClick = false), 200);
    }

    // interaction: on mouse up, it desides whether a click or a drag was done by user
    function dragEnd() {
        if (isNaN(dragStartYear)) {
            // If the mouse doesn't end on the graph, ignore input
            return;
        }
        if (interactionIsClick) {
            // If a quick press, treat as a click
            newMapYear(selectedData.year);
            return;
        }
        if (dragStartYear === selectedData.year) {
            // If long press ends where it started, treat as a click
            newMapYear(selectedData.year);
        }
        else if (parseInt(dragStartYear) > parseInt(selectedData.year)) {
            // If the start year is bigger than the end year, make with start
            newMapYear(Math.round((parseInt(dragStartYear) + parseInt(selectedData.year)) / 2));
            callNewChartTimeRange(selectedData.year, dragStartYear)

            //console.log("B " + selectedData.year)
        }
        else {
            newMapYear(Math.round((parseInt(dragStartYear) + parseInt(selectedData.year)) / 2));
            callNewChartTimeRange(dragStartYear, selectedData.year)

            //console.log("A " + selectedData.year)
        };
    }


    //----- SET GLOBAL VARIABLES -----


    // filteredData_POINT is to use for the main line and rolling average
    // Filter the data to only show values from the range of years chosen
    filteredData_point = data.filter(function (data) {
        // If the year is in range
        if ((parseInt(data["year"]) >= yearMin) && (parseInt(data["year"]) <= yearMax)) {
            return true;
        }
    });

    // filteredData_REGION is to use for the regional line.  This is so that the region does not have to show the active point
    //pointsInRegion = Object.keys(pointIndex)
    filteredData_region = [];
    getPointsInRegion()

    data.forEach(function (d) {

        if ((parseInt(d["year"]) >= yearMin) && (parseInt(d["year"]) <= yearMax)) {
            //Just get points in our region
            filteredData_region.push(filterOutOfRegion(d))
        }
    });

    x = getXaxis()
    y = getYaxis()



    //----- DEFINE LOCAL VARIABLES -----

    // This allows to find the closest X index of the mouse:
    let bisect = d3.bisector(function (d) { return d.year; }).left;

    // Determine main line stroke width depending on how many years are in view
    strokeWidth = ((100 / ((yearMax - yearMin))) + .5)



    // Drag and Click Interactions
    let interactionIsClick;
    let dragStartYear;


    let generalStatsArray = (makeGeneralStatsArray(filteredData_point));






    /*----- Run Important Functions -----*/


    // -- make Temporal and Regional Dataframes --
    console.log(filteredData_point)
    console.log(filteredData_region)
    // Create datum of X year average values from LBDA_csv
    createTemporalAverageDatum(filteredData_point)
    createSpatialAverageDatum(filteredData_region)


    // -- add SVG elements to svgHolder --


    // add the axes (set to x and y globals)
    addAxes();
    // add a gradient based on max and min years
    addGradient();
    // Create the lines and focuses that make up the graph
    setReferenceLine(); // line that shows 0 pmdi
    setMainLine();      // line that shows point pmdi for every year
    setTemporalLine();  // line that shows temporal average for point
    setRegionalLine();  // line that shows regional average for region
    setFocuses();       // add the 3 focuses to follow the mouse movement
    // Create a rect on top of the svg area: this rectangle recovers mouse position
    addInteractionRectangle();


    // -- make Temporal and Regional Dataframes --

    // changes the title
    setLinegraphTitle();


    calcSummaryStatistics(generalStatsArray);
    mouseout();
    changeActiveAverageFunction(true);
}