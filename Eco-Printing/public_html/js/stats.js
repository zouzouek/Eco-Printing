/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function getMostUsedExtensionFiles(jsonObject) {
    var tempJson = [];

    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            var currentYear = new Date().getFullYear();
            var yearFile = jsonObject[key].DataPrinted.substring(6, 10)
            if (currentYear.toString() === yearFile)
            {
                var file = jsonObject[key];
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
    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            
            var currentYear = new Date().getFullYear();
            var yearFile = jsonObject[key].DataPrinted.substring(6, 10);

            if (currentYear.toString() === yearFile)
            {
                var monthFile = parseInt(jsonObject[key].DataPrinted.substring(4, 6));
                tempJson[monthFile - 1] = tempJson[monthFile - 1] + jsonObject[key].TotalPagesPrinted * 6;
            }
        }
    }
    return tempJson;

}

function getTotalPapersPrinted(jsonObject) {
    var totalPapers = 0;
     for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            var currentYear = new Date().getFullYear();
            var yearFile = jsonObject[key].DataPrinted.substring(6, 10);

            if (currentYear.toString() === yearFile)
            {
                totalPapers = totalPapers + jsonObject[key].TotalPagesPrinted;
            }
        }
    }
    return totalPapers;
}
function getTotalColoredPapersPrinted(jsonObject) {
    var totalPapers = 0;
     for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            var currentYear = new Date().getFullYear();
            var yearFile = jsonObject[key].DataPrinted.substring(6, 10);

            if (currentYear.toString() === yearFile)
            {
                if(jsonObject[key].Colored ==='true') {
                    totalPapers = totalPapers + jsonObject[key].TotalPagesPrinted;
                }
            }
        }
    }
    return totalPapers;
}



var barChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
        {
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: new Array(12)
        }
    ]

}

var pieData = [
    {
        value: 0,
        highlight: "#B81C27",
        color: "#D53D48",
        label: "Red"
    },
    {
        value: 0,
        color: "#6CBAB2",
        highlight: "#13746A",
        label: "Green"
    },
    {
        value: 0,
        color: "#F6A467",
        highlight: "#DB813F",
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

var pieDataColoredBlackWhite = [
    {
        value: 0,
        highlight: "#B81C27",
        color: "#D53D48",
        label: "Colored"
    },
    {
        value: 0,
        color: "#6CBAB2",
        highlight: "#13746A",
        label: "Black and White"
    }
];
function drawStats(data) {
    
    var pieResult = getMostUsedExtensionFiles(data.Files);
    for (var i = 0; i < pieResult.length && i < 5; i++)
    {
        pieData[i].label = pieResult[i].extension;
        pieData[i].value = pieResult[i].totalPages;
    }
    

    var monthlyCO2 = getMonthlyCO2(data.Files);
    barChartData.datasets[0].data = monthlyCO2;

    var totalPapers = getTotalPapersPrinted(data.Files);
    document.getElementById("totalPages").innerHTML =  totalPapers;
    document.getElementById("totalCO2").innerHTML =  totalPapers * 6;
    document.getElementById("totalTrees").innerHTML = totalPapers / 8000;
    var ctx2 = document.getElementById("piechart").getContext("2d");
    window.myPie = new Chart(ctx2).Doughnut(pieData);
    
    var ctx = document.getElementById("bargraph").getContext("2d");
    window.myBar = new Chart(ctx).Bar(barChartData, {
        responsive: true
    });
   
    var totalPrintedPapers = getTotalColoredPapersPrinted(data.Files);
    var totalBlackWhitePapers = totalPapers - totalPrintedPapers;
    pieDataColoredBlackWhite[0].value = totalPrintedPapers;
    pieDataColoredBlackWhite[1].value = totalBlackWhitePapers;
    var ctx3 = document.getElementById("piechartColoredBlackWhite").getContext("2d");
    window.myPie2 = new Chart(ctx3).Doughnut(pieDataColoredBlackWhite);

}
;