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
    helpWindowContent = "<b><em><font size='5vmin'>Interactive</em></font> <font size='5.7vmin'>Living Blended Drought Atlas</b></font>" 
    helpWindowContent += "<br><br><br> <b>THIS SITE IS CURRENTLY IN DEVELOPMENT</b> - I apologize for any bugs encountered.<br><a href='mailto:aidanmarler1@gmail.com' target='_blank'>Any feedback</a> would be greatly appreciated!"+"<br><br><br><br>"

    // Main Help
    //helpWindowContent += "<b><font size='4vmin'>Intent</font></b>"
    helpWindowContent += "<br></span>PMDI<span class = 'greyText'> stands for </span>Palmer's Modified Drought Index<span class = 'greyText'>." + "</br>"
    helpWindowContent += "+ Positive + values represent wetter conditions.</br> - Negative - values represent drier conditions." + "</br></br>"
    helpWindowContent += "From <span class = 'timeText_dark'>1979</span> to <span class = 'timeText_dark'>2017 CE</span>,</span> PMDI <span class = 'greyText'> is calculated using temperature and precipitation. </br>"
    helpWindowContent += "Every year before that (<span class = 'timeText_dark'>0</span> to <span class = 'timeText_dark'>1978 CE</span>), </span> PMDI <span class = 'greyText'> is estimated by tree-ring thickness." + "</br>"
    helpWindowContent += "All calculations and estimations are of summertime drought (<span class = 'timeText_dark'>June-August</span>)." + "</br>"

    // !! ADD Biliography HERE !!
    //helpWindowContent += "To learn more check out these papers:"


    // Further help, link the video
    helpWindowContent += "</span><br><br><br><br> This data comes from NOAA's "
    helpWindowContent += "<font size='4vmin'><a href='https://www.ncei.noaa.gov/access/paleo-search/study/22454' target='_blank'>Living Blended Drought Atlas v2</a>.</font>"
    helpWindowContent += "<font size='2vmin'><br>The <a href='http://iridl.ldeo.columbia.edu/SOURCES/.LDEO/.TRL/.NADA2004/.pdsi-atlas.html' target='_blank'>North American Drought Atlas</a>"
    helpWindowContent += " inspired this visualization." + "<br><br>"
    helpWindowContent += "<i>For assitance, comments, or questions, email me at <a href='mailto:aidanmarler1@gmail.com' target='_blank'>aidanmarler1@gmail.com</a>."
    helpWindowContent += "<br> The following plugins are used: <a href='https://d3js.org/' target='_blank'>D3</a>, <a href='https://leafletjs.com/' target='_blank'>Leaflet</a>." + "</br></br>"
    helpWindowContent += "And thank you to the teams of researches who have collected, analyzed, and shared this data!"+"</font>"
    // Data Used and further resources, link the data used (geology, topography, soils)
}
