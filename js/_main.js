// MAIN

function main() {
    getLBDA()
    getPointIndex()
    createMap()
    setTimeout(() => buildLineChart(lbda_csv), 400);
    setTimeout(() => document.body.style.cursor = "default", 500);
}
document.body.style.cursor = "wait";
$(document).ready(main);