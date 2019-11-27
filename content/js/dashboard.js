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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8083333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.96, 500, 1500, "api\/tokenholders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account\/list  "], "isController": false}, {"data": [1.0, 500, 1500, "api\/vote\/witness\u65B0"], "isController": false}, {"data": [0.99, 500, 1500, "api\/trc10trc20-transfer"], "isController": false}, {"data": [0.98, 500, 1500, "api\/account\/list\u65B0"], "isController": false}, {"data": [0.5, 500, 1500, "api\/transfer"], "isController": false}, {"data": [0.61, 500, 1500, "api\/trc10trc20-transfer\u65B0"], "isController": false}, {"data": [0.97, 500, 1500, "api\/token_trc20\/transfers"], "isController": false}, {"data": [0.97, 500, 1500, "api\/token\u65B0"], "isController": false}, {"data": [0.5, 500, 1500, "api\/token_trc20\/holders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token"], "isController": false}, {"data": [0.5, 500, 1500, "api\/asset\/transfer"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/witness\u65B0"], "isController": false}, {"data": [0.98, 500, 1500, "api\/token_trc20\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/vote\/witness"], "isController": false}, {"data": [0.4, 500, 1500, "api\/transfer\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\/transfers\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20\/holders"], "isController": false}, {"data": [0.04, 500, 1500, "api\/asset\/transfer\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20"], "isController": false}, {"data": [1.0, 500, 1500, "api\/tokenholders"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account"], "isController": false}, {"data": [1.0, 500, 1500, "api\/witness"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 0, 0.0, 843.9799999999998, 0, 16552, 1599.600000000004, 5894.100000000011, 12352.110000000002, 5.735205559325922, 89.86961629981265, 0.9371983042908896], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["api\/tokenholders\u65B0", 50, 0, 0.0, 118.51999999999998, 30, 1826, 133.09999999999994, 805.3499999999997, 1826.0, 0.2488020182819723, 0.3316550341356369, 0.043977700497106434], "isController": false}, {"data": ["api\/account\/list  ", 50, 0, 0.0, 59.99999999999999, 49, 98, 74.6, 82.14999999999998, 98.0, 0.248389196063528, 0.22073649259551806, 0.03395946039931047], "isController": false}, {"data": ["api\/vote\/witness\u65B0", 50, 0, 0.0, 33.13999999999999, 19, 481, 29.499999999999993, 73.4999999999997, 481.0, 0.24853612224000635, 15.618446801464374, 0.03349412584875086], "isController": false}, {"data": ["api\/trc10trc20-transfer", 50, 0, 0.0, 112.12, 34, 680, 287.8, 367.99999999999983, 680.0, 0.2570324066458299, 2.3767967368450815, 0.07881657781913144], "isController": false}, {"data": ["api\/account\/list\u65B0", 50, 0, 0.0, 259.46000000000004, 17, 10067, 170.79999999999993, 322.25, 10067.0, 0.24849165565020329, 0.29289983239237827, 0.033488133280984426], "isController": false}, {"data": ["api\/transfer", 50, 0, 0.0, 634.2399999999997, 534, 907, 780.0999999999999, 814.9499999999999, 907.0, 0.2483053162168202, 0.822593805092742, 0.032978049810046435], "isController": false}, {"data": ["api\/trc10trc20-transfer\u65B0", 50, 0, 0.0, 1160.4399999999996, 41, 7708, 3206.8, 3861.5499999999984, 7708.0, 0.25731547906995894, 3.1036166816338504, 0.07840081002912812], "isController": false}, {"data": ["api\/token_trc20\/transfers", 50, 0, 0.0, 132.74000000000004, 30, 1058, 320.6999999999998, 810.8999999999992, 1058.0, 0.2513030060865588, 1.469779007277735, 0.0677340133592678], "isController": false}, {"data": ["api\/token\u65B0", 50, 0, 0.0, 174.02, 76, 1728, 204.99999999999991, 855.3999999999958, 1728.0, 0.2487846868049578, 3.0177290964886527, 0.031826947237743625], "isController": false}, {"data": ["api\/token_trc20\/holders\u65B0", 50, 0, 0.0, 918.3399999999999, 740, 1280, 1038.3, 1087.75, 1280.0, 0.24775410900189776, 0.28719153064966085, 0.03508236895046404], "isController": false}, {"data": ["api\/token", 50, 0, 0.0, 14.960000000000003, 13, 42, 14.899999999999999, 32.19999999999993, 42.0, 0.2488936676473077, 3.009571672665004, 0.03232700956747258], "isController": false}, {"data": ["api\/asset\/transfer", 50, 0, 0.0, 591.38, 527, 759, 671.0, 731.9, 759.0, 0.24897298643097227, 0.7804622339101208, 0.034525550852732484], "isController": false}, {"data": ["api\/account\u65B0", 50, 0, 0.0, 1.1800000000000002, 0, 2, 2.0, 2.0, 2.0, 0.24854847689493362, 0.02087418848922294, 0.03228217522170524], "isController": false}, {"data": ["api\/witness\u65B0", 50, 0, 0.0, 43.05999999999999, 33, 133, 64.5, 77.49999999999996, 133.0, 0.24854847689493362, 17.3724705532192, 0.03228217522170524], "isController": false}, {"data": ["api\/token_trc20\u65B0", 50, 0, 0.0, 56.719999999999985, 15, 641, 75.59999999999997, 442.6999999999988, 641.0, 0.24888003982080636, 1.85760756284221, 0.03329742720258835], "isController": false}, {"data": ["api\/vote\/witness", 50, 0, 0.0, 72.04000000000002, 57, 144, 77.5, 83.44999999999999, 144.0, 0.24846572415335302, 15.506250854100927, 0.03396992322409124], "isController": false}, {"data": ["api\/transfer\u65B0", 50, 0, 0.0, 1342.6, 740, 5943, 2184.8, 3532.149999999997, 5943.0, 0.24808970923886078, 0.8600330191897391, 0.03246486429492905], "isController": false}, {"data": ["api\/token_trc20\/transfers\u65B0", 50, 0, 0.0, 10619.72, 2606, 16552, 13096.3, 14780.05, 16552.0, 0.24936412149019999, 1.2916282230312703, 0.06672438407061992], "isController": false}, {"data": ["api\/token_trc20\/holders", 50, 0, 0.0, 62.68, 48, 196, 84.39999999999999, 166.39999999999986, 196.0, 0.24853241608302973, 0.3062967862273276, 0.0356779933244193], "isController": false}, {"data": ["api\/asset\/transfer\u65B0", 50, 0, 0.0, 3671.2999999999993, 829, 6978, 6073.6, 6923.75, 6978.0, 0.24750024750024752, 0.756596655034155, 0.03383792446292446], "isController": false}, {"data": ["api\/token_trc20", 50, 0, 0.0, 31.099999999999998, 29, 43, 32.9, 42.0, 43.0, 0.24886269747255044, 6.725368581208876, 0.03378116694207472], "isController": false}, {"data": ["api\/tokenholders", 50, 0, 0.0, 73.74000000000001, 57, 391, 92.9, 124.2499999999998, 391.0, 0.24877107090970607, 0.34011669850936377, 0.044458111305152544], "isController": false}, {"data": ["api\/account", 50, 0, 0.0, 12.319999999999999, 11, 24, 13.0, 17.499999999999957, 24.0, 0.2485336514564072, 0.03761983982006163, 0.03276566694005368], "isController": false}, {"data": ["api\/witness", 50, 0, 0.0, 59.699999999999996, 46, 169, 69.9, 105.59999999999971, 169.0, 0.24850894632206758, 17.275740090705767, 0.03276240991550696], "isController": false}]}, function(index, item){
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
