// funciton to calc static summary statistics for 
function calcSummaryStatistics(array) {
    meanVal = mean(array)
    minVal = min(array)
    maxVal = max(array)
    //modeVal = mode(array)
    medianVal = median(array)
    rmsVal = rootMeanSquare(array)
    sdVal = sampleStandardDeviation(array)
    madVal = medianAbsoluteDeviation(array)
    iqrVal = interquartileRange(array)
    countVal = array.length
    nullCountVal = ((yearMax - yearMin) + 1) - countVal
    skewnessVal = sampleSkewness(array)
    //let tStatistic = zScore(array)*/

    // set the panels as variables so that the html contents can be edited
    addGeneralStatsTitle();
    addGeneralStatsLabels();
    addGeneralStatsValues();
}

// Builds the title of the general stats panel
function addGeneralStatsTitle() {
    const statsPanel_title = document.getElementById("generalStatsPanel_title");
    statsPanel_title.innerHTML = "<span class = 'timeText_light'><b>" + yearMin + " - " + yearMax + " CE</b></span>" + "</br>"
    statsPanel_title.innerHTML += "<font size='-0'><span class = 'spaceText_light'><b>" + pointInView_lat + ", " + pointInView_lon + "</b></span></font>"
}

//builds the label column of the stats panel
function addGeneralStatsLabels() {
    const statsPanel_labels = document.getElementById("generalStatsPanel_labels");

    statsPanel_labels.innerHTML = "<div class = 'tooltip smallText'>Mean<span class='tooltiptext'>Average</span></div>" + ":</br>"
    statsPanel_labels.innerHTML += "<div class = 'tooltip smallText'>Median<span class='tooltiptext'>Middle Value</span></div>" + ":</br>"
    statsPanel_labels.innerHTML += "<div class = 'tooltip smallText'>SD<span class='tooltiptext'>Standard Deviation</span></div>" + ":</br>"
    statsPanel_labels.innerHTML += "<div class = 'tooltip smallText'>Count<span class='tooltiptext'>Number of points used in calculation</span></div>" + ":</br>"
    statsPanel_labels.innerHTML += "<div class = 'tooltip smallText'>Nulls<span class='tooltiptext'>Number of points ommited from calculation</span></div>" + ":</br>" + "</br>"

    // Min and Max
    statsPanel_labels.innerHTML += "<div class = 'tooltip smallText'>Min<span class='tooltiptext'>Minimum</span></div>" + ":</br>"
    statsPanel_labels.innerHTML += "<div class = 'tooltip smallText'>Max<span class='tooltiptext'>Maximum</span></div>" + ":</br>" + "</br>"
    statsPanel_labels.innerHTML += "<div class = 'tooltip smallText'>Skewness<span class='tooltiptext'>Direction and Strength of skew</span></div>" + ":</br>"
    
    statsPanel_labels.innerHTML += "<div class = 'tooltip smallText'>IQR<span class='tooltiptext'>Inter Quartile Range</span></div>" + ":</br>"

    //statsPanel_labels.innerHTML += "<div class = 'tooltip smallText'>RMS<span class='tooltiptext'>Root Mean Square</span></div>" + ":</br>"
    statsPanel_labels.innerHTML += "<div class = 'tooltip smallText'>MAD<span class='tooltiptext'>Mean Absolute Deviation</span></div>" + ":</br>"
}

//builds the value column of the stats panel
function addGeneralStatsValues() {
    const statsPanel_values = document.getElementById("generalStatsPanel_values");
    
    statsPanel_values.innerHTML = meanVal.toFixed(3) + "</br>"
    statsPanel_values.innerHTML += medianVal.toFixed(3) + "</br>"
    statsPanel_values.innerHTML += sdVal.toFixed(3) + "</br>"
    statsPanel_values.innerHTML += countVal + "</br>"
    statsPanel_values.innerHTML += nullCountVal + "</br>" + "</br>"

    // Min and Max
    statsPanel_values.innerHTML += minVal.toFixed(3) + "</br>"
    statsPanel_values.innerHTML += maxVal + "</br>" + "</br>"
    // Mean
    statsPanel_values.innerHTML += skewnessVal.toFixed(3) + "</br>"
    statsPanel_values.innerHTML += iqrVal.toFixed(3) + "</br>"
    //statsPanel_values.innerHTML += rmsVal.toFixed(3) + "</br>"
    statsPanel_values.innerHTML += madVal.toFixed(3) + "</br>"
}


//==========================================================

// Calculate AVERAGE PMDI over X years

function makeGeneralStatsArray(data) {
    var generalStatsArray = [];
    data.forEach(function (d) {
        // If year val is null then return
        if (d[pointInView] == '') {
            return
        }
        // else push pmdi to array
        generalStatsArray.push(
            parseFloat(d[pointInView])
        )
    })
    return (generalStatsArray)
}

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

    averageValue = mean(averageList)
    standardDeviationValue = sampleStandardDeviation(averageList)

    return [averageValue, standardDeviationValue, averageList.length];
}

// Calculate the Average for every year in the dataframe.
function createTemporalAverageDatum(data) {
    //data[year][pointID]
    //console.log(data[2017][2274])
    // for year in range, get data[year][pointID], calc avg for that point, and then add it to a datum

    temporal_averageData = [];

    // Loop through each row (year) of the data
    data.forEach(function (d) {

        // if there is no value for that point and year, then return nothing, otherwise calc the average
        if ((d[pointInView]) == "") {
            var yearMean = ["", 0];
        } else {
            var yearMean = calculateYearlyAverage(parseInt(d.year), averageRange);
        };

        // Add the mean to the newData array
        temporal_averageData.push({
            year: d.year,
            average: yearMean[0],
            sd: yearMean[1],
            yearsUsed: yearMean[2]
        });
    });
};

function calculateRegionalAverage(data) {
    let averageValue = 0;
    let averageList = [];

    for (const property in data) {
        if ((property != "year") && (data[property] != "")) {
            averageList.push(parseFloat(data[property]))
        }
    }

    averageList.forEach((value) => {
        averageValue += value;
    })

    averageValue = averageValue / averageList.length;
    //console.log(year, averageList)

    return [averageValue, averageList.length];
}

//---------------------------------------------------------------

function createSpatialAverageDatum(data) {
    spatial_averageData = [];
    data.forEach(function (d) {
        let regionalMean = calculateRegionalAverage(d);
        spatial_averageData.push({
            year: d.year,
            average: regionalMean[0],
            pointsUsed: regionalMean[1],
        })
    })
    //console.log(spatial_averageData)
}

//calcSummaryStatistics ([1, 2, 3, 4, 5, 6])