//declare map variable globally so all functions have access
var map;
var dataStats = {};
var selectedYear = "2017";
var complete_dataset

//step 1 create map
function createMap() {

    //create the map
    map = L.map('map', {
        center: [38, -97.5],
        zoom: 4,
        keyboard: false
    });

    /*
    //set tile layer and add to map
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    })
    */

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        minZoom: 3
    }).addTo(map);

    //call getData function
    getData(map);

    var yearHolder = createHeadingContent(2017);
    updateHeadingContent(yearHolder)

    map.on('zoomend', function () {
        updatePropSymbols(selectedYear);
    });
};

/*
// funciton to calculate min max and mean PMDI over a given time 
function calcStatsInRange(data, minYear, maxYear) {
    //create empty array to store all data values
    var allValues = [];
    //loop through each city

    for (var point of data.features) {
        for (let y = minYear; y <= maxYear; y++) {
            if (point.properties[y] != "NA") {
                allValues.push(point.properties[y])
            }

        }

    }
    //get min, max, mean stats for our array
    dataStats.min = Math.min(...allValues);
    dataStats.max = Math.max(...allValues);
    //calculate meanValue
    var sum = allValues.reduce(function (a, b) { return a + b; });
    dataStats.mean = (sum / allValues.length).toFixed(4);

    console.log(dataStats)

    $('#statsPanel').html("<p>Avg: " + dataStats["mean"] + "      Max: " + dataStats["max"] + "      Min: " + dataStats["min"] + "</p>")

}*/

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue / dataStats["min"], 0.5715) * minRadius

    return radius;
};

function calcColor(pmdi) {
    var color = "white"


    if (pmdi < 1 && pmdi > -1) {
        color = "#B7B2A7" // grey
    } else if (pmdi >= 1 && pmdi < 2) {
        color = "#A0E1EC" // light blue greenish
    } else if (pmdi <= -1 && pmdi > -2) {
        color = "#E2C480" // light yellow
    } else if (pmdi >= 2 && pmdi < 3) {
        color = "#78CDE8" // blue
    } else if (pmdi <= -2 && pmdi > -3) {
        color = "#E1B44C" // yellow
    } else if (pmdi >= 3 && pmdi < 4) {
        color = "#46B2D5" // saturated blue
    } else if (pmdi <= -3 && pmdi > -4) {
        color = "#D19A30" // saturated yellow
    } else if (pmdi >= 4 && pmdi < 6) {
        color = "#2684B6" // dark blue
    } else if (pmdi <= -4 && pmdi > -6) {
        color = "#BD7F16" // orangish yellow
    } else if (pmdi >= 6) {
        color = "#004970" // very blue
    } else if (pmdi <= -6) {
        color = "#935600" // very orange
    };

    return color
}


function calcSize(pmdi) {
    var zoom = map.getZoom();
    var zoomIndex = 1;

    if (zoom > 4) {
        zoomIndex = (zoom * 2) / (5)
    }
    var size = 1.2 * zoomIndex

    if (pmdi < 1 && pmdi > -1) {
        size = 2.5 * zoomIndex
    } else if (pmdi >= 1 && pmdi < 2) {
        size = 3 * zoomIndex
    } else if (pmdi <= -1 && pmdi > -2) {
        size = 3 * zoomIndex
    } else if (pmdi >= 2 && pmdi < 3) {
        size = 4 * zoomIndex
    } else if (pmdi <= -2 && pmdi > -3) {
        size = 4 * zoomIndex
    } else if (pmdi >= 3 && pmdi < 4) {
        size = 5 * zoomIndex
    } else if (pmdi <= -3 && pmdi > -4) {
        size = 5 * zoomIndex
    } else if (pmdi >= 4 && pmdi < 6) {
        size = 6.5 * zoomIndex
    } else if (pmdi <= -4 && pmdi > -6) {
        size = 6.5 * zoomIndex
    } else if (pmdi >= 6) {
        size = 9 * zoomIndex
    } else if (pmdi <= -6) {
        size = 9 * zoomIndex
    };
    return size
}

//function to convert markers to circle markers
function pointToLayer(feature, latlng, year) {
    //Determine which attribute to visualize with proportional symbols
    //var attribute = attributes[0];
    // check
    //console.log(attribute);

    //Create Header
    //var yearHolder = createHeadingContent(attribute);
    //updateHeadingContent(yearHolder)

    var pointColor = calcColor(feature.properties[selectedYear])
    var pointRadius = calcSize(feature.properties[selectedYear])


    //create marker options
    var options = {
        fillColor: pointColor,
        color: "white",
        weight: 0,
        opacity: 1,
        fillOpacity: .9
    };

    if ((latlng.lat == pointIndex[pointInView]["latitude"]) && (latlng.lng == pointIndex[pointInView]["longitude"])) {
        options.weight = 3
    }

    //For each feature, determine its value for the selected attribute
    //var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = pointRadius //calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //add formatted attribute to panel content string
    var popupContent = createPopupContent(feature, year);

    /*
    //bind the popup to the circle marker    
    layer.bindPopup(popupContent, {
        offset: new L.Point(0, -options.radius)
    });
    */
    layer.bindTooltip(popupContent)


    layer.on('click', point_clickOn);

    function point_clickOn() {
        {
            callNewChartPoint(latlng["lat"], latlng["lng"])
            updatePropSymbols(selectedYear)
        }
    };

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, year) {
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return pointToLayer(feature, latlng, year);
        }
    }).addTo(map);
};

//Step 1: Create new sequence controls
function createSequenceControls(attributes) {
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            // ... initialize other DOM elements
            $(container).append('<input class="range-slider" type="range">');
            //add skip buttons
            //below Example 3.6...add step buttons
            $(container).append('<button class="step" id="reverse"><img src="img/left.png"></button>');
            $(container).append('<button class="step" id="forward"><img src="img/right.png"></button>');

            //replace button content with images
            $('#reverse').html('<img src="img/left.png">');
            $('#forward').html('<img src="img/right.png">');

            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);


            return container;
        }

    });

    map.addControl(new SequenceControl());

    $('.range-slider').attr({
        max: 2017,
        min: 0,
        value: 2017,
        step: 1
    });

    $('.step').click(function () {
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward') {
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 2017 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse') {
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 2017 : index;
        };

        //Step 8: update slider
        $('.range-slider').val(index);
        selectedYear = index
        updatePropSymbols(selectedYear);

    });

    //Step 5: input listener for slider
    $('.range-slider').on('input', function () {
        var index = $(this).val();
        //console.log(index);
        selectedYear = index
        updatePropSymbols(selectedYear);

    });

};

// Add keyboard input to change year
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        if (selectedYear > 0) {
            year = parseInt(selectedYear) - 1
            lineGraphNewYear(year)
            return
        }
        lineGraphNewYear(2017)
        return
    }
    else if (event.keyCode == 39) {
        if (parseInt(selectedYear) < 2017) {
            year = parseInt(selectedYear) + 1
            lineGraphNewYear(year)
            return
        }
        lineGraphNewYear(0)
        return
    }
});

// function to set a new year based on typing and submitting a new year
function inputYear() {
    var inputString = document.getElementById("yearMapInput").value;
    var inputInt = parseInt(inputString)
    if ((inputInt <= 2017) && (inputInt >= 0)) {
        document.getElementById("yearMapInput").value = ""
        selectedYear = inputString;
        $('.range-slider').val(selectedYear);
        updatePropSymbols(selectedYear);
    }
    else {
        alert("Not in range 0-2017")
    }
}

// function to set a new year based on clicking on the linegraph
function lineGraphNewYear(year) {
    selectedYear = year;
    $('.range-slider').val(year);
    updatePropSymbols(year);
}

function createPopupContent(feature, year) {

    //add formatted attribute to panel content string
    //var year = attribute.split("_")[1];
    var popupContent = "";
    popupContent += feature.properties[year];
    //console.log(popupContent)
    //popupContent += "<p id=popupCoordinates>" + "Latitude:  " + feature.geometry.coordinates[1] + ", Longitude: " + feature.geometry.coordinates[0] + "</p>";


    return popupContent;
};

// I created the header fuctions before realizing we were gonna add that information
//  so, I do not actually call them
function createHeadingContent(year) {

    //add formatted attribute to panel content string
    headingContent = "<b>" + year + "</b>";

    return headingContent;
};

function updateHeadingContent(header) {
    //add formatted attribute to panel content string
    //document.getElementById("yearHeader").innerHTML = header;
    document.getElementById("mapYearLabel").innerHTML = "Map Year: " + header;
    document.getElementById("mapTitle").innerHTML = "<span>Summer of </span>" + header;
    //console.log("Map Year: " + header)
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(year) {
    //console.log(year)
    map.eachLayer(function (layer) {
        //Example 3.18 line 4
        if (layer.feature && layer.feature.properties[year]) {
            //access feature properties
            var props = layer.feature;

            //update each feature's radius based on new attribute values
            var radius = calcSize(props.properties[year]);
            layer.setRadius(radius);

            var pointColor = calcColor(props.properties[year]);
            layer.setStyle({ fillColor: pointColor });
            //layer.setContent(color)

            if ((layer._latlng.lat == pointIndex[pointInView]["latitude"]) && (layer._latlng.lng == pointIndex[pointInView]["longitude"])) {
                layer.setStyle({ weight: 3 })
            } else {
                layer.setStyle({ weight: 0 })
            }

            //add city to popup content string
            var popupContent = createPopupContent(props, year);

            layer.bindTooltip(popupContent)
            //update popup with new content    
            //popup = layer.getPopup();
            //popup.setContent(popupContent).update();
        };
    });

    // Update Header
    var yearHolder = createHeadingContent(year);
    updateHeadingContent(yearHolder)

    // Update Legend
    //updateLegend(year);

    // Update Stats
    //calcStatsInRange(complete_dataset, selectedYear, selectedYear);


};

function getCircleValues(attribute) {
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function (layer) {
        //get the attribute value
        if (layer.feature) {
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min) {
                min = attributeValue;
            }

            //test for max
            if (attributeValue > max) {
                max = attributeValue;
            }
        }
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min,
    };
}

// create legend.  make title, circles, and labels
function createLegend(year) {
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            $(container).append('<div class="temporalLegend"><b>PMDI in <span class="year">1980</span></b></div>');

            // COME BACK TO WHEN DONE
            //set attribute and call update legend
            //var attribute = attributes[0]
            //updateLegend(attribute)

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="60px">';

            //array of circle names to base loop on  
            var circles = ["max", "mean", "min"];

            //Step 2: loop to add each circle and text to svg string  
            for (var i = 0; i < circles.length; i++) {

                //Step 3: assign the r and cy attributes            
                var radius = calcPropRadius(dataStats[circles[i]]);
                var cy = 59 - radius;

                //circle string            
                svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '"cy="' + cy + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="30"/>';

                //evenly space out labels            
                var textY = i * 20 + 20;

                //text string            
                svg += '<text id="' + circles[i] + '-text" x="65" y="' + textY + '">' + Math.round(dataStats[circles[i]] * 100) / 100 + " million" + '</text>';
            };

            //close svg string
            svg += "</svg>";

            //add attribute legend svg to container
            $(container).append(svg);

            return container;
        }
    });

    map.addControl(new LegendControl());
    updateLegend(year);
};

function updateLegend(year) {
    //create content for legend
    var content = "<b>PMDI in " + year + "</b>";

    //replace legend content
    $(".temporalLegend").html(content);
    //console.log(content)


    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(attribute);

    for (var key in circleValues) {
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        $("#" + key).attr({
            cy: 59 - radius,
            r: radius,
        });

        $("#" + key + "-text").text(
            Math.round(circleValues[key] * 100) / 100 + " million"
        );
    }
}

/*
function processData(data) {
    //empty array to hold attributes
    var attributes = [];
 
    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
 
    //push each attribute name into attributes array
    for (var attribute in properties) {
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1) {
            attributes.push(attribute);
        };
    };
 
    //check result
    //console.log(attributes);
 
    return attributes;
};
*/

//
function createStatsPanel(response, activeYear, minYear, maxYear, point) {
    var yearStatsContainer = L.DomUtil.create('div', 'year-stats-container');
}

//Import GeoJSON data
function getData(map) {
    //load the data
    $.ajax("data/PMDI_points.geojson", {
        dataType: "json",
        success: function (response) {
            //create an attributes array
            //var attributes = processData(response);
            complete_dataset = response
            createPropSymbols(response, selectedYear);
            createSequenceControls(selectedYear);
            //createStatsPanel(response, selectedYear, minYear, maxYear);
            //createLegend(selectedYear);
            //calcStatsInRange(complete_dataset, selectedYear, selectedYear);
        }
    });
};

$(document).ready(createMap);

//console.log(complete_dataset)