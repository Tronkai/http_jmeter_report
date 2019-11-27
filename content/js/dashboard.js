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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7891666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.86, 500, 1500, "api\/tokenholders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account\/list  "], "isController": false}, {"data": [0.98, 500, 1500, "api\/vote\/witness\u65B0"], "isController": false}, {"data": [0.96, 500, 1500, "api\/trc10trc20-transfer"], "isController": false}, {"data": [0.97, 500, 1500, "api\/account\/list\u65B0"], "isController": false}, {"data": [0.5, 500, 1500, "api\/transfer"], "isController": false}, {"data": [0.65, 500, 1500, "api\/trc10trc20-transfer\u65B0"], "isController": false}, {"data": [0.93, 500, 1500, "api\/token_trc20\/transfers"], "isController": false}, {"data": [0.8, 500, 1500, "api\/token\u65B0"], "isController": false}, {"data": [0.44, 500, 1500, "api\/token_trc20\/holders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token"], "isController": false}, {"data": [0.5, 500, 1500, "api\/asset\/transfer"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/witness\u65B0"], "isController": false}, {"data": [0.91, 500, 1500, "api\/token_trc20\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/vote\/witness"], "isController": false}, {"data": [0.36, 500, 1500, "api\/transfer\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\/transfers\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20\/holders"], "isController": false}, {"data": [0.08, 500, 1500, "api\/asset\/transfer\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20"], "isController": false}, {"data": [1.0, 500, 1500, "api\/tokenholders"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account"], "isController": false}, {"data": [1.0, 500, 1500, "api\/witness"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 0, 0.0, 733.9149999999994, 0, 11257, 2120.7000000000057, 4564.250000000008, 8877.79, 6.54015107748989, 102.43093285376767, 1.0687356252929443], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["api\/tokenholders\u65B0", 50, 0, 0.0, 326.97999999999996, 29, 2360, 882.0, 1001.6999999999995, 2360.0, 0.2866413657887797, 0.3818152567733355, 0.050666100788837036], "isController": false}, {"data": ["api\/account\/list  ", 50, 0, 0.0, 62.50000000000001, 49, 95, 83.9, 91.14999999999998, 95.0, 0.28597247800871645, 0.2541356982304023, 0.0390977997277542], "isController": false}, {"data": ["api\/vote\/witness\u65B0", 50, 0, 0.0, 68.53999999999999, 19, 2317, 28.799999999999997, 59.34999999999999, 2317.0, 0.28615578320837864, 17.973042336748126, 0.038563962971441657], "isController": false}, {"data": ["api\/trc10trc20-transfer", 50, 0, 0.0, 162.05999999999997, 32, 1447, 300.3, 1228.449999999999, 1447.0, 0.2977892128835525, 2.7536777898382407, 0.09131427035687059], "isController": false}, {"data": ["api\/account\/list\u65B0", 50, 0, 0.0, 105.3, 16, 1271, 358.59999999999985, 667.65, 1271.0, 0.2860984750951277, 0.33694800875461334, 0.03855623980774183], "isController": false}, {"data": ["api\/transfer", 50, 0, 0.0, 614.9999999999999, 532, 963, 717.1999999999999, 785.9499999999999, 963.0, 0.28675150687916867, 0.9470696594682481, 0.03808418450738959], "isController": false}, {"data": ["api\/trc10trc20-transfer\u65B0", 50, 0, 0.0, 1190.0800000000004, 42, 9348, 3222.6, 4056.4999999999986, 9348.0, 0.30010023347798165, 3.619665999693898, 0.09143678988782254], "isController": false}, {"data": ["api\/token_trc20\/transfers", 50, 0, 0.0, 227.62000000000015, 30, 3391, 289.0999999999999, 1817.8999999999974, 3391.0, 0.2935598832805904, 1.7169239657885311, 0.07912356229047163], "isController": false}, {"data": ["api\/token\u65B0", 50, 0, 0.0, 508.54, 98, 4398, 1695.499999999999, 2387.849999999999, 4398.0, 0.2867959160261558, 3.4788008525008602, 0.03668971191350235], "isController": false}, {"data": ["api\/token_trc20\/holders\u65B0", 50, 0, 0.0, 1143.62, 856, 2036, 1632.6999999999998, 1735.6999999999996, 2036.0, 0.2849960955534909, 0.33036168498241575, 0.040355892436773615], "isController": false}, {"data": ["api\/token", 50, 0, 0.0, 15.520000000000001, 12, 34, 25.0, 27.799999999999983, 34.0, 0.2869341658249931, 3.4695496496533833, 0.03726781645969149], "isController": false}, {"data": ["api\/asset\/transfer", 50, 0, 0.0, 596.8800000000001, 533, 759, 677.2, 707.35, 759.0, 0.28771182783324223, 0.9026452854820611, 0.03989753862531289], "isController": false}, {"data": ["api\/account\u65B0", 50, 0, 0.0, 0.9800000000000002, 0, 2, 1.0, 2.0, 2.0, 0.28619345532806356, 0.02403577847481784, 0.037171610897102005], "isController": false}, {"data": ["api\/witness\u65B0", 50, 0, 0.0, 38.20000000000001, 32, 74, 47.9, 68.69999999999997, 74.0, 0.28623277594270763, 20.00370179482262, 0.03717671796912121], "isController": false}, {"data": ["api\/token_trc20\u65B0", 50, 0, 0.0, 230.04, 14, 3659, 661.4, 1454.099999999997, 3659.0, 0.28690946858628225, 2.1414541683642145, 0.03838534882453191], "isController": false}, {"data": ["api\/vote\/witness", 50, 0, 0.0, 72.61999999999996, 58, 103, 79.9, 101.0, 103.0, 0.2860821055642969, 17.819612939851236, 0.03911278787011872], "isController": false}, {"data": ["api\/transfer\u65B0", 50, 0, 0.0, 1551.7999999999997, 443, 4579, 3401.999999999999, 3790.8499999999985, 4579.0, 0.28717477456780194, 0.994954025113434, 0.03757951151570846], "isController": false}, {"data": ["api\/token_trc20\/transfers\u65B0", 50, 0, 0.0, 7329.82, 2679, 11257, 10273.9, 11137.45, 11257.0, 0.29080757262919127, 1.5062923488527642, 0.07781374501992032], "isController": false}, {"data": ["api\/token_trc20\/holders", 50, 0, 0.0, 55.67999999999999, 48, 112, 73.6, 91.99999999999991, 112.0, 0.2862098376045381, 0.3527312647040304, 0.041086763796745224], "isController": false}, {"data": ["api\/asset\/transfer\u65B0", 50, 0, 0.0, 3143.06, 609, 6820, 5269.3, 6096.4, 6820.0, 0.28759433094054854, 0.8782355710329238, 0.039319537433278116], "isController": false}, {"data": ["api\/token_trc20", 50, 0, 0.0, 32.7, 28, 48, 41.9, 43.79999999999998, 48.0, 0.2868814835215276, 7.752803997550032, 0.038941920126457356], "isController": false}, {"data": ["api\/tokenholders", 50, 0, 0.0, 68.5, 58, 105, 81.8, 87.79999999999998, 105.0, 0.2865592260608423, 0.3906608199032576, 0.05121126793860755], "isController": false}, {"data": ["api\/account", 50, 0, 0.0, 11.58, 11, 12, 12.0, 12.0, 12.0, 0.2861754369898923, 0.043317571028743465, 0.03772820702503463], "isController": false}, {"data": ["api\/witness", 50, 0, 0.0, 56.34000000000001, 47, 82, 67.0, 79.35, 82.0, 0.2861787128826209, 19.89156129626079, 0.037728638905423655], "isController": false}]}, function(index, item){
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
