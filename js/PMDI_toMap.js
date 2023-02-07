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

    //set tile layer and add to map
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        minZoom: 3
    }).addTo(map);

    //call getData function
    getData(map);

    // make headings that use the year shown in map
    var yearHolder = createHeadingContent(2017);
    updateHeadingContent(yearHolder)

    //  Add function so that on zoom the symbols color and size are updated
    map.on('zoomend', function () {
        updatePropSymbols(selectedYear);
    });
};

// Function to calculate the dot color given the point value
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

// Funciton to calculate the dot size given value and map zoom level
function calcSize(pmdi) {
    var zoom = map.getZoom();
    var zoomIndex = 1;

    if (zoom > 4) {
        zoomIndex = ((zoom * 2) / (5))
    }
    var size = 1.2 * zoomIndex

    if (pmdi < 1 && pmdi > -1) {
        size = 2.5 * zoomIndex
        //console.log(zoomIndex)
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
    return size;
}

//function to convert markers to circle markers
function pointToLayer(feature, latlng, year) {
    //Create point with specific features
    function buildPoint() {
        //create marker options
        var options = {
            fillColor: pointColor,
            color: "white",
            weight: 0,
            opacity: 1,
            fillOpacity: .9,
            TransitionEvent: 1
        };

        // If it is the selected point, then give it a border
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

        // Bind the tooltip to each point
        layer.bindTooltip(popupContent)

        // Call event on click
        layer.on('click', point_clickOn);

        // On click, do this
        function point_clickOn() {
            {
                callNewChartPoint(latlng["lat"], latlng["lng"])
                updatePropSymbols(selectedYear)
            }
        };

        //return the circle marker to the L.geoJson pointToLayer option
        return layer;
    };
    var pointColor = calcColor(feature.properties[selectedYear]);
    var pointRadius = calcSize(feature.properties[selectedYear]);
    // rest of the code that uses variable1 and variable2
    var point = buildPoint();
    //console.log(point)
    return point
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
        selectedYear = index;
        updatePropSymbols(selectedYear);

    });

    //Step 5: input listener for slider
    $('.range-slider').on('input', function () {
        var index = $(this).val();
        //console.log(index);
        selectedYear = index;
        updatePropSymbols(selectedYear);

    });

};

// Add keyboard input to change year
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        if (selectedYear > 0) {
            year = parseInt(selectedYear) - 1
            newMapYear(year)
            return
        }
        newMapYear(2017)
        return
    }
    else if (event.keyCode == 39) {
        if (parseInt(selectedYear) < 2017) {
            year = parseInt(selectedYear) + 1
            newMapYear(year)
            return
        }
        newMapYear(0)
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
function newMapYear(year) {
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
    document.getElementById("mapYearLabel").innerHTML = "Map Year: <span class = 'timeText_dark'>" + header + "</span>";
    document.getElementById("mapTitle").innerHTML = "<span class = 'smallText'>Summer of </span><span class = 'timeText_dark'>" + header + "</span>";
    //console.log("Map Year: " + header)
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(year) {
    //console.log(year)
    map.eachLayer(function (layer) {
        //Example 3.18 line 4
        if (layer.feature && layer.feature.properties[year]) {
            function restylePoint() {
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
            }
            restylePoint();
        };
    });

    // Update Header
    var yearHolder = createHeadingContent(year);
    updateHeadingContent(yearHolder)
    moveToolTipFromMap()
};

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

function moveToolTipFromMap() {
    let selectedData = filteredData[selectedYear]
    // set the input variables
    let year = selectedYear
    let pmdi = selectedData[pointInView]
    let selectedRollingAverageData = temporal_averageData[selectedYear]
    let selectedRegionalAverageData = spatial_averageData[selectedYear]
    // move tooltip with selected variables
    moveToolTip(year, pmdi, selectedRollingAverageData, selectedRegionalAverageData)
}