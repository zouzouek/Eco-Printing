/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function getMostUsedExtensionFiles(jsonObject) {
    console.log(jsonObject);
    var tempJson = [];
    for (i = 0; i < jsonObject.length; i++) {
        var currentYear = new Date().getFullYear();
        var yearFile = jsonObject[i].DataPrinted.substring(6, 10)
        if (currentYear.toString() === yearFile)
        {
            var file = jsonObject[i];
            var extensionExists = 0;
            for (var j = 0; j < tempJson.length; j++)
            {
                if (tempJson[j].extension === file.Extension) {
                    extensionExists = 1;
                    tempJson[j].totalPages = tempJson[j].totalPages + file.TotalPagesPrinted;
                    break;
                }
            }
            if (!extensionExists)
            {
                tempJson.push({
                    extension: file.Extension,
                    totalPages: file.TotalPagesPrinted
                });
            }
        }
    }
    tempJson.sort(function (a, b) {
        return parseFloat(b.totalPages) - parseFloat(a.totalPages);
    });
    return tempJson;
}
//source: http://www.cs.toronto.edu/~lungj/blog/?p=6
function getMonthlyCO2(jsonObject) {
    var tempJson = new Array(12);
    for (i = 0; i < tempJson.length; i++) {
        tempJson[i] = 0;
    }
    for (i = 0; i < jsonObject.length; i++) {
        var currentYear = new Date().getFullYear();
        var yearFile = jsonObject[i].DataPrinted.substring(6, 10);

        if (currentYear.toString() === yearFile)
        {
            var monthFile = parseInt(jsonObject[i].DataPrinted.substring(4, 6));
            tempJson[monthFile - 1] = tempJson[monthFile - 1] + jsonObject[i].TotalPagesPrinted * 6;
        }
    }
    return tempJson;
}

function getTotalPapersPrinted(jsonObject) {
    var totalPapers = 0;
    for (i = 0; i < jsonObject.length; i++) {
        var currentYear = new Date().getFullYear();
        var yearFile = jsonObject[i].DataPrinted.substring(6, 10);

        if (currentYear.toString() === yearFile)
        {
            totalPapers = totalPapers + jsonObject[i].TotalPagesPrinted;
        }
    }
    return totalPapers;
}

ref.once("value", function (snapshot) {
    var data = snapshot.val();
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

var barChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
        {
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: new Array(12)
        }
    ]

}

var pieData = [
    {
        value: 0,
        color: "#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 0,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 0,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    },
    {
        value: 0,
        color: "#949FB1",
        highlight: "#A8B3C5",
        label: "Grey"
    },
    {
        value: 0,
        color: "#4D5360",
        highlight: "#616774",
        label: "Dark Grey"
    }

];
$(function () {


    var pieResult = getMostUsedExtensionFiles(data);
    for (var i = 0; i < pieResult.length && i < 5; i++)
    {
        pieData[i].label = pieResult[i].extension;
        pieData[i].value = pieResult[i].totalPages;
    }

    var monthlyCO2 = getMonthlyCO2(data);
    barChartData.datasets[0].data = monthlyCO2;

    var totalPapers = getTotalPapersPrinted(data);
    document.getElementById("totalPages").innerHTML = "Total pages printed: " + totalPapers;
    document.getElementById("totalCO2").innerHTML = "Total gramms of CO2 emmited: " + totalPapers * 6;
    document.getElementById("totalTrees").innerHTML = "Ammount of trees killed: " + totalPapers / 8000;
    window.onload = function () {
        var ctx = document.getElementById("bargraph").getContext("2d");
        window.myBar = new Chart(ctx).Bar(barChartData, {
            responsive: true
        });

        var ctx2 = document.getElementById("piechart").getContext("2d");
        window.myPie = new Chart(ctx2).Doughnut(pieData);
    }

});