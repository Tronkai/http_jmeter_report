/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7979166666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.91, 500, 1500, "api\/tokenholders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account\/list  "], "isController": false}, {"data": [1.0, 500, 1500, "api\/vote\/witness\u65B0"], "isController": false}, {"data": [0.99, 500, 1500, "api\/trc10trc20-transfer"], "isController": false}, {"data": [0.89, 500, 1500, "api\/account\/list\u65B0"], "isController": false}, {"data": [0.5, 500, 1500, "api\/transfer"], "isController": false}, {"data": [0.61, 500, 1500, "api\/trc10trc20-transfer\u65B0"], "isController": false}, {"data": [0.96, 500, 1500, "api\/token_trc20\/transfers"], "isController": false}, {"data": [0.93, 500, 1500, "api\/token\u65B0"], "isController": false}, {"data": [0.51, 500, 1500, "api\/token_trc20\/holders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token"], "isController": false}, {"data": [0.5, 500, 1500, "api\/asset\/transfer"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/witness\u65B0"], "isController": false}, {"data": [0.96, 500, 1500, "api\/token_trc20\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/vote\/witness"], "isController": false}, {"data": [0.32, 500, 1500, "api\/transfer\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\/transfers\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20\/holders"], "isController": false}, {"data": [0.07, 500, 1500, "api\/asset\/transfer\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20"], "isController": false}, {"data": [1.0, 500, 1500, "api\/tokenholders"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account"], "isController": false}, {"data": [1.0, 500, 1500, "api\/witness"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 0, 0.0, 755.2474999999997, 0, 14510, 1974.1000000000017, 4993.050000000007, 9756.12, 6.397611558351549, 100.19929018166552, 1.045443034600416], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["api\/tokenholders\u65B0", 50, 0, 0.0, 262.18000000000006, 30, 2316, 1013.1999999999999, 1365.0499999999995, 2316.0, 0.2812686340470056, 0.37465861019542546, 0.04971642847901174], "isController": false}, {"data": ["api\/account\/list  ", 50, 0, 0.0, 60.86, 49, 93, 80.9, 85.0, 93.0, 0.2812496484379394, 0.24993865242043448, 0.03845210037237454], "isController": false}, {"data": ["api\/vote\/witness\u65B0", 50, 0, 0.0, 26.02, 19, 121, 37.699999999999996, 51.19999999999993, 121.0, 0.28141269171239625, 17.674519839594765, 0.037924757281553395], "isController": false}, {"data": ["api\/trc10trc20-transfer", 50, 0, 0.0, 74.34000000000002, 33, 680, 138.89999999999995, 268.9499999999997, 680.0, 0.29300079696216774, 2.7093989711277016, 0.08984594750597721], "isController": false}, {"data": ["api\/account\/list\u65B0", 50, 0, 0.0, 246.70000000000005, 16, 3444, 724.2999999999997, 1714.9499999999982, 3444.0, 0.28137310073157007, 0.3313827729319077, 0.037919421778278], "isController": false}, {"data": ["api\/transfer", 50, 0, 0.0, 623.94, 538, 813, 761.2, 801.5, 813.0, 0.2803649229837557, 0.9215956426384583, 0.03723596633378005], "isController": false}, {"data": ["api\/trc10trc20-transfer\u65B0", 50, 0, 0.0, 1370.4999999999998, 44, 9876, 4812.4, 6058.649999999999, 9876.0, 0.29324653235975484, 3.5369999230227855, 0.0893485528283628], "isController": false}, {"data": ["api\/token_trc20\/transfers", 50, 0, 0.0, 145.16, 29, 2597, 145.29999999999998, 912.25, 2597.0, 0.28208426421140526, 1.6498072835567439, 0.07603052433823031], "isController": false}, {"data": ["api\/token\u65B0", 50, 0, 0.0, 295.15999999999997, 90, 3088, 551.1999999999998, 1134.849999999997, 3088.0, 0.2811436925412578, 3.410240043998988, 0.035966624729399196], "isController": false}, {"data": ["api\/token_trc20\/holders\u65B0", 50, 0, 0.0, 761.2600000000001, 470, 1480, 1040.1, 1350.25, 1480.0, 0.28041838422927007, 0.3250552950001402, 0.03970768136059], "isController": false}, {"data": ["api\/token", 50, 0, 0.0, 17.26, 13, 109, 26.0, 27.0, 109.0, 0.2812828749360081, 3.401215388142239, 0.03653381090477449], "isController": false}, {"data": ["api\/asset\/transfer", 50, 0, 0.0, 616.3399999999999, 539, 965, 745.5999999999999, 810.5499999999997, 965.0, 0.2810346571939251, 0.879418918691053, 0.03897160285306384], "isController": false}, {"data": ["api\/account\u65B0", 50, 0, 0.0, 1.0, 0, 2, 1.8999999999999986, 2.0, 2.0, 0.28146021559852513, 0.023638260294407385, 0.03655684440879282], "isController": false}, {"data": ["api\/witness\u65B0", 50, 0, 0.0, 43.65999999999999, 33, 170, 67.69999999999999, 94.49999999999996, 170.0, 0.2813857686333656, 19.665655671048782, 0.036547175027575804], "isController": false}, {"data": ["api\/token_trc20\u65B0", 50, 0, 0.0, 110.76000000000002, 14, 2247, 358.0999999999997, 850.0999999999998, 2247.0, 0.28127971016938663, 2.0994343992427953, 0.037632148723833955], "isController": false}, {"data": ["api\/vote\/witness", 50, 0, 0.0, 73.22, 69, 114, 81.9, 93.4499999999999, 114.0, 0.2813303549826419, 17.534936394723367, 0.03846313447028307], "isController": false}, {"data": ["api\/transfer\u65B0", 50, 0, 0.0, 1738.3, 394, 6261, 2880.7, 4804.899999999998, 6261.0, 0.27983926032886713, 0.9671288561850073, 0.03661959070709784], "isController": false}, {"data": ["api\/token_trc20\/transfers\u65B0", 50, 0, 0.0, 7998.4800000000005, 3505, 14510, 11825.5, 12444.999999999998, 14510.0, 0.2771511083272822, 1.4355561314139695, 0.07415957390788605], "isController": false}, {"data": ["api\/token_trc20\/holders", 50, 0, 0.0, 55.90000000000002, 48, 174, 67.69999999999999, 80.69999999999997, 174.0, 0.2814158594721764, 0.34682306118543615, 0.0403985657640722], "isController": false}, {"data": ["api\/asset\/transfer\u65B0", 50, 0, 0.0, 3436.2200000000003, 569, 9536, 6813.0999999999985, 7981.449999999992, 9536.0, 0.27859498974770436, 0.848952935555407, 0.038089158754568954], "isController": false}, {"data": ["api\/token_trc20", 50, 0, 0.0, 30.840000000000003, 18, 45, 42.0, 42.0, 45.0, 0.2812717985643888, 7.601205548508134, 0.038180449219189484], "isController": false}, {"data": ["api\/tokenholders", 50, 0, 0.0, 67.04, 58, 162, 74.9, 79.24999999999997, 162.0, 0.28122275654545964, 0.38338571107173997, 0.05025758246857336], "isController": false}, {"data": ["api\/account", 50, 0, 0.0, 12.12, 11, 24, 12.0, 16.949999999999953, 24.0, 0.2814427883099923, 0.042601203308641415, 0.03710427384946188], "isController": false}, {"data": ["api\/witness", 50, 0, 0.0, 58.67999999999998, 47, 102, 70.9, 87.39999999999995, 102.0, 0.2813667672083915, 19.557468766530295, 0.03709425153626255], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1200, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
