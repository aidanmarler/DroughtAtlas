'use strict';

// Define our 3 elements as contant variables
const helpIcon = document.getElementById("helpIcon_main");
const helpWindow = document.getElementById("helpWindow_main");
const helpWindowClose = document.getElementById("helpWindowClose");

// Create bool to store if the help prompt is open, and set it to false
let isOpen = false;

// Create an event listener to check if the user has clicked on the help prompt icon
helpIcon.addEventListener("click", function () {
    // If the prompt was open, close it by changing the icon, 
    //      moving the promp below the background, and setting isOpen as false
    if (isOpen === true) {
        helpIcon.innerHTML = "?"
        helpWindow.style.zIndex = (-2);
        isOpen = false;
    // If the prompt was closed, open it by changing the icon, 
    //      moving the promp above the rest of the site, and setting isOpen as true
    } else {
        helpIcon.innerHTML = "X"
        helpWindow.style.zIndex = (9998);
        isOpen = true;
    };
});

// On mouse over, set the icon to reflect that
helpIcon.addEventListener("mouseover", function () {
    helpIcon.style.backgroundColor = "rgb(255, 217, 0)";
    helpIcon.style.borderColor = "rgb(255, 217, 0)"
});

// On mouse out, set the icon back to normal
helpIcon.addEventListener("mouseout", function () {
    helpIcon.style.backgroundColor = "white";
    helpIcon.style.borderColor = "white"
});


// Add text to fill the help prompt here!
// Title
helpWindow.innerHTML = "<font size='+3'><b>Exploring the Springs of Northern Nebraska</b></font>"


helpWindow.innerHTML += "<br><br> Data was sourced from "
helpWindow.innerHTML += "<a href='https://www.ncei.noaa.gov/products/paleoclimatology/drought-variability' target='_blank'>NOAA's library of PaleoClimatic data</a>."
//helpWindow.innerHTML += "The data is specifically the <a href='https://www.ncei.noaa.gov/products/paleoclimatology/drought-variability' target='_blank'> NOAA's library of PaleoClimatic data</a>".

// PCP Instructions
helpWindow.innerHTML += "<br><br><font size='+2'><b>Parallel Coordinate Plot</b></font"
helpWindow.innerHTML += "<br>The large lined graph is a <b>Parallel Coordinate Plot. </b>"
helpWindow.innerHTML += "<br> <b>-</b> Colors on this graph represent <b>Hydrologic Groups.</b>"
helpWindow.innerHTML += "<br> <b>-</b> To filter, click and drag on any of the verical axes.  To remove a filter, click anywhere else on that axis."
helpWindow.innerHTML += "<br> <b>-</b> To reorder the axes, click and drag their label."
helpWindow.innerHTML += "<br> <b>-</b> Hovering over any spring point on the map will display just that line on the parallel coordinate plot.  "

// Map Instructions
helpWindow.innerHTML += "<br><br><font size='+2'><b>Map</b></font"
helpWindow.innerHTML += "<br> <b>-</b> A <b>marker</b> can be placed by clicking on the map.  Hovering over the marker will reveal information about that point."
helpWindow.innerHTML += "<br> - - The marker can be moved by clicking somewhere else on the map and can be removed by clicking on the existing marker"
helpWindow.innerHTML += "<br> - - - If the marker is not showing its data or is not disapearing after clicking it, try clicking around the map to reset the marker.  If the marker is still not working, reloading the page will fix the issue."
helpWindow.innerHTML += "<br> <b>-</b> The <b>checkboxes</b> allow you to set a layer on the map to be active or not.  They are transparent, allowing the visualization of multiple layers at once."
helpWindow.innerHTML += "<br> <b>-</b> The <b>legend</b> reflects the top-most active layer.  The farther right a layer is in the checkbox window, the lower it is in relation to the other layers."
helpWindow.innerHTML += "<br> <b>-</b> The <b>base layer</b> can be changed with the layers icon on the top right of the map window."

// Matrix Instructions
helpWindow.innerHTML += "<br><br><font size='+2'><b>Heatmap</b></font"
helpWindow.innerHTML += "<br>The <b>Heatmap</b> is the black and blue graph on the right side of the screen."
helpWindow.innerHTML += "<br> <b>-</b> The intensity of blue of each box reflects the number of springs in that category."
helpWindow.innerHTML += "<br> <b>-</b> By <b>hovering</b> over a box, the number of springs will be displayed at the bottom of the graph."

// Further help, link the video
helpWindow.innerHTML += "<font size='-1'><br><br><br> <i>For more assitance with the application, see <b><a href='https://youtu.be/Aonnehx7d1k' target='_blank'>this video.</a></b> Or, you can email us at <a href='mailto:aima7917@colorado.edu' target='_blank'>aima7917@colorado.edu</a>. or <a href='mailto:jiko1138@colorado.edu' target='_blank'>jiko1138@colorado.edu</a></i>.</font>"
helpWindow.innerHTML += "<font size='-1'><br> We sourced our <a href='https://mrdata.usgs.gov/geology/state/state.php?state=NE' target='_blank'>data on geology from here</a>, our <a href='https://apps.nationalmap.gov/downloader/' target='_blank'>data on topography and hydrology here</a>, and our <a href='https://data.nal.usda.gov/dataset/gridded-soil-survey-geographic-database-gssurgo' target='_blank'>and our data on soils from here</a>.</font>"
helpWindow.innerHTML += "<font size='-1'><br> We used the following plugins: <a href='https://d3js.org/' target='_blank'>D3</a>, <a href='https://syntagmatic.github.io/parallel-coordinates/' target='_blank'>D3 Parallel Coordinates</a>, <a href='https://leafletjs.com/' target='_blank'>Leaflet</a>, and <a href='https://github.com/mapbox/leaflet-pip' target='_blank'>Leaflet Point in Polygon</a>.</font>"
// Data Used and further resources, link the data used (geology, topography, soils)