function createData(startval) {    // returns array of x y coords in format [[x1,y1], [x2, y2], [x3, y3] ... ] starting at x=0
    var mydataset = []
    var i = 0
    while (i < 31) {
        var amt = Math.round(startval*Math.pow(1.136,i))
        mydataset[i] = [i, amt]
        i++
    }
    return mydataset
}

function makeChart(dataset) { // only used in the inital creation of global chart myChart with a blank dataset. Cannot be called again while myChart exists
    var options = {
        chart: {
            type:'line',
            toolbar : {
                show: false
            }
        },
        tooltip: {
            enabled : false,
            shared : false
        },
        series: [{
            name : 'Returns',
            data : dataset
        }],
        xaxis: {
            type : 'category',
            title : {
                text : 'Years Later',
                style: {
                    fontSize:  '14px',
                    fontWeight:  'bold',
                    fontFamily:  'Calibri',
                    color:  '#263238'
                    }
            }
        },
        yaxis: {
            title : {
                text : 'Estimated Value (in $)',
                style: {
                    fontSize:  '14px',
                    fontWeight:  'bold',
                    fontFamily:  'Calibri',
                    color:  '#263238'
                }
            }
        }
        }
    var chart = new ApexCharts(document.querySelector("#chart"), options) // no clue how this works btw but it links to the chart div
    chart.render();
    return chart
} 

function userGivenChart() { // takes in the user input from customAmt textbox, runs createData to generate the xy points, updates the myChart dataset
    var newamt = document.getElementById("customAmt").value;
    var newdataset = createData(newamt)
    myChart.updateSeries([{
    name : 'Returns',
    data : newdataset
    }])
    let infoForTable = [
        [newdataset[0][0], newdataset[0][1]], [newdataset[1][0], newdataset[1][1]],[newdataset[3][0], newdataset[3][1]], [newdataset[5][0], newdataset[5][1]], [newdataset[7][0], 
        newdataset[7][1]], [newdataset[10][0], newdataset[10][1]], [newdataset[15][0], newdataset[15][1]], [newdataset[20][0], newdataset[20][1]], [newdataset[25][0], 
        newdataset[25][1]], [newdataset[30][0], newdataset[30][1]]
    ]
    populateTable(infoForTable)
}
function backTenStock(multiplierArray) { //accepts an array 10 multipiers, compunds the given value and creates a dataset in format [ [x0,y0], [x1,y1] ...]
    var newamt = document.getElementById('customAmt').value
    //var multipliers = [1, 1.188, 1.05, 1.5, 0.86, 1.15, 1.5, 0.93, 1.93, 1.63]
    var i = 0
    var year = 2012
    var newdataset = []
    while (i < 10) {
      newamt = Math.round((multiplierArray[i] * newamt))
      newdataset[i] = [year, newamt]
      year++
      i++
    }
    myChart.updateSeries([{
        data : newdataset
    }])
    populateTable(newdataset)
}
function populateTable(contentsArray) { //array must be 10 XY pairings in format array = [[x0, y0], [x1, y1] ...]
    let table = document.getElementById('tableBody')
    let rowOne = document.createElement("tr")
    let i = 0
    let xheader = document.createElement("th")
    let xhText = document.createTextNode("Year")
    xheader.appendChild(xhText)
    rowOne.appendChild(xheader)
    while (i < 10) {
        let newCell = document.createElement("td")
        let newText = document.createTextNode((contentsArray[i][0]).toString())
        newCell.appendChild(newText)
        rowOne.appendChild(newCell)
        i++
    }
    table.appendChild(rowOne)
    let rowTwo = document.createElement("tr")
    let yheader = document.createElement("th")
    let yhText = document.createTextNode("Value ($)")
    yheader.appendChild(yhText)
    rowTwo.appendChild(yheader)
    let c = 0
    while (c < 10) {
        let newCell = document.createElement("td")
        let newText = document.createTextNode((contentsArray[c][1]).toString())
        newCell.appendChild(newText)
        rowTwo.appendChild(newCell)
        c++
        //uncomment to log info to check if table data is consistent with the array
        //console.log(contentsArray[c][1])
        //console.log((contentsArray[c][1]).toString())
    }
    table.appendChild(rowTwo)
}
function clearTable() { //check for a table, clears one if it exists
    let node = document.getElementById("tableBody");
    while (node.hasChildNodes()) {
        console.log("removing " + node.lastChild + "from" + node.id)
        node.removeChild(node.lastChild);
    }
}

function whenFormisSubmit() { //Determines what data to use in the graph and calls relevant function. WIll always run clearTable() even if one is not present
    clearTable()
    var histdatabox = document.getElementById('histDataSwitch')
    var stockselector = document.getElementById('stock')
    selectedStock = stockselector[stockselector.selectedIndex].value
    if(histdatabox.checked) {
        switch(selectedStock) {
            case "AAPL":
                backTenStock(appleMultiplierList);
                break;
            case "SPY":
                backTenStock(spyMultiplierList);
                break;
            case "MSFT":
                backTenStock(msftMultiplierList);
                break;
            case "FB":
                backTenStock(fbMultiplierList);
                break;
            case "AMZN":
                backTenStock(amznMultiplierList);
                break;
            default:
                console.log('selectionError');
        }
    } else {
        userGivenChart()
    }
}
var amznMultiplierList = [1, 1.46, 1.55, 0.78, 2.1, 1.15, 1.55, 1.25, 1.28, 1.75]
var fbMultiplierList = [1, 0.71, 2, 1.27, 1.41, 1.18, 1.42, 0.9, 1.31, 1.21]
var spyMultiplierList = [1, 1.13, 1.23, 1.12, 0.97, 1.14, 1.25, 0.94, 1.20, 1.57]
var msftMultiplierList = [1, 0.933, 1.32, 1.27, 1.17, 1.18, 1.46, 1.13, 1.63, 1.28]
var appleMultiplierList = [1, 1.188, 1.05, 1.5, 0.86, 1.15, 1.5, 0.93, 1.93, 1.63]
var myChart = makeChart([]) // initializes a blank chart "myChart", global variable

