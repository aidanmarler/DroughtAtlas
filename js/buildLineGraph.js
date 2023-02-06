let x;
let y;
let focusMain;
let focusRollingAverage;
let focusRegionalAverage;
let focusYearLine;
let filteredData;
let selectedData;

//Read the PMDI data
//d3.csv("data/LBDA_main.csv", function (data) {
function buildLineChart(data) {

    

    //----- DEFINE LOCAL FUNCTIONS -----

    // Create a rect on top of the svg area: this rectangle recovers mouse position
    function setInteractionRectangle() {
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
        var tracer = bisect(filteredData, x0, 0);
        selectedData = filteredData[tracer]
        // set the input variables
        let year = selectedData.year
        let pmdi = selectedData[pointInView]
        let selectedRollingAverageData = temporal_averageData[tracer]
        let selectedRegionalAverageData = spatial_averageData[tracer]
        // move tooltip with selected variables
        moveToolTip(year, pmdi, selectedRollingAverageData, selectedRegionalAverageData)
    }

    // interaction: When mouse leaves the visualization, remove the popup
    function mouseout() {
        selectedData = filteredData[selectedYear]
        // set the input variables
        let year = selectedYear
        let pmdi = selectedData[pointInView]
        let selectedRollingAverageData = temporal_averageData[selectedYear]
        let selectedRegionalAverageData = spatial_averageData[selectedYear]
        // move tooltip with selected variables
        moveToolTip(year, pmdi, selectedRollingAverageData, selectedRegionalAverageData)
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
            newMapYear(Math.round((parseInt(dragStartYear)+parseInt(selectedData.year))/2));
            callNewChartTimeRange(selectedData.year, dragStartYear)
            
            //console.log("B " + selectedData.year)
        }
        else {
            newMapYear(Math.round((parseInt(dragStartYear)+parseInt(selectedData.year))/2));
            callNewChartTimeRange(dragStartYear, selectedData.year)
            
            //console.log("A " + selectedData.year)
        };
    }


    //----- SET GLOBAL VARIABLES -----

    // Filter the data to only show values from the range of years chosen
    filteredData = data.filter(function (data) {

        if ((parseInt(data["year"]) >= yearMin) && (parseInt(data["year"]) <= yearMax)) {
            return data;
        }
    })

    x = getXaxis()
    y = getYaxis()



    //----- DEFINE LOCAL VARIABLES -----

    // This allows to find the closest X index of the mouse:
    let bisect = d3.bisector(function (d) { return d.year; }).left;

    // Determine main line stroke width depending on how many years are in view
    let strokeWidth = ((100 / ((yearMax - yearMin))) + .5)



    // Drag and Click Interactions
    let interactionIsClick;
    let dragStartYear;


    let generalStatsArray = (makeGeneralStatsArray(filteredData));






    //----- Run important functions -----

    // add the axes (set to x and y globals, and then set the gradient becuase why not)
    setAxesAndGradient()

    // Create datum of X year average values from LBDA_csv
    createTemporalAverageDatum(filteredData)
    createSpatialAverageDatum(filteredData)

    // Create the lines and focuses that make up the graph
    setLinesAndFocuses(strokeWidth);
    // Create a rect on top of the svg area: this rectangle recovers mouse position
    setInteractionRectangle();

    setLinegraphTitle();


    //console.log(generalStatsArray)
    calcSummaryStatistics(generalStatsArray);
    mouseout()
}