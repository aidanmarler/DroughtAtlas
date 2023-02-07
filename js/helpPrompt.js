'use strict';

helpWindowMain()

function helpWindowMain() {
    // Define our 3 elements as constant variables
    const helpIcon = document.getElementById("helpIcon_main");
    const helpWindow = document.getElementById("helpWindow_main");

    // Create bool to store if the help prompt is open, and set it to false
    let isOpen = false;
    // Create a string to hold all the written content in
    let helpWindowContent = "";

    // Create an event listener to check if the user has clicked on the help prompt icon
    helpIcon.addEventListener("click", function () {
        // If the prompt was open, close it by changing the icon, 
        //      moving the promp below the background, and setting isOpen as false
        if (isOpen === true) {
            helpIcon.innerHTML = "?"
            helpWindow.style.zIndex = (-2);
            isOpen = false;
            //make yellow
            helpIcon.style.backgroundColor = "rgb(255, 217, 0)";
            helpIcon.style.borderColor = "rgb(255, 217, 0)";
            // empty the window of its contents
            helpWindow.innerHTML = "";
        } else {
            helpIcon.innerHTML = "X"
            helpWindow.style.zIndex = (9998);
            isOpen = true;
            //make red
            helpIcon.style.backgroundColor = "rgb(214, 79, 79)"
            helpIcon.style.borderColor = "rgb(214, 79, 79)"
            // set the window to have contents
            helpWindow.innerHTML = helpWindowContent;
        };
    });

    // On mouse over, set the icon to reflect that
    helpIcon.addEventListener("mouseover", function () {
        if (isOpen) {
            //make red
            helpIcon.style.backgroundColor = "rgb(214, 79, 79)"
            helpIcon.style.borderColor = "rgb(214, 79, 79)"
        } else {
            //make yellow
            helpIcon.style.backgroundColor = "rgb(255, 217, 0)";
            helpIcon.style.borderColor = "rgb(255, 217, 0)"
        }

    });

    // On mouse out, set the icon back to normal
    helpIcon.addEventListener("mouseout", function () {
        helpIcon.style.backgroundColor = "white";
        helpIcon.style.borderColor = "white"
    });


    // Add text to fill the help prompt here!
    // Title
    helpWindowContent = "<b><em><font size='5vmin'>Interactive</em></font> <font size='6vmin'>Living Blended Drought Atlas</b></font>" 
    helpWindowContent += "<br><br><br>THIS SITE IS CURRENTLY IN DEVELOPMENT--I apologize for any bugs encountered.<br>"

    // Main Help
    //helpWindowContent += "<b><font size='4vmin'>Intent</font></b>"
    helpWindowContent += "<br>PMDI stands for Palmer's Modified Drought Index." + "</br>"
    helpWindowContent += "+ Positive values represent wetter conditions.</br> - Negative values represent drier conditions." + "</br></br>"
    helpWindowContent += "From 2017 to 1979, PMDI was calculated using temperature and precipitation. </br> From 1978 to 0 CE (1 BC), PMDI is estimated by tree-ring thickness." + "</br>"
    helpWindowContent += "All calculations and estimations are of summertime drought (June-August)." + "</br>"

    // Further help, link the video
    helpWindowContent += "<br><br><br><br> This data comes from NOAA's "
    helpWindowContent += "<a href='https://www.ncei.noaa.gov/access/paleo-search/study/22454' target='_blank'>Living Blended Drought Atlas v2</a>."
    helpWindowContent += "<br><br> The <a href='http://iridl.ldeo.columbia.edu/SOURCES/.LDEO/.TRL/.NADA2004/.pdsi-atlas.html' target='_blank'>North American Drought Atlas</a>"
    helpWindowContent += " inspired this visualization." + "<br><br>"
    helpWindowContent += "<font size='-1'> <i>For more assitance with the application, email me at <a href='mailto:aidanmarler1@gmail.com' target='_blank'>aidanmarler1@gmail.com</a>.</font>"
    helpWindowContent += "<font size='-1'><br> We used the following plugins: <a href='https://d3js.org/' target='_blank'>D3</a>, <a href='https://leafletjs.com/' target='_blank'>Leaflet</a>.</font>"
    // Data Used and further resources, link the data used (geology, topography, soils)
}
