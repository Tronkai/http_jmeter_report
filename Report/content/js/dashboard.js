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

    var data = {"OkPercent": 50.0, "KoPercent": 50.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4816666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "api\/tokenholders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account\/list  "], "isController": false}, {"data": [0.0, 500, 1500, "api\/vote\/witness\u65B0"], "isController": false}, {"data": [0.97, 500, 1500, "api\/trc10trc20-transfer"], "isController": false}, {"data": [0.0, 500, 1500, "api\/account\/list\u65B0"], "isController": false}, {"data": [0.82, 500, 1500, "api\/transfer"], "isController": false}, {"data": [0.0, 500, 1500, "api\/trc10trc20-transfer\u65B0"], "isController": false}, {"data": [0.94, 500, 1500, "api\/token_trc20\/transfers"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\/holders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token"], "isController": false}, {"data": [0.83, 500, 1500, "api\/asset\/transfer"], "isController": false}, {"data": [0.0, 500, 1500, "api\/account\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/witness\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/vote\/witness"], "isController": false}, {"data": [0.0, 500, 1500, "api\/transfer\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\/transfers\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20\/holders"], "isController": false}, {"data": [0.0, 500, 1500, "api\/asset\/transfer\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20"], "isController": false}, {"data": [1.0, 500, 1500, "api\/tokenholders"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account"], "isController": false}, {"data": [1.0, 500, 1500, "api\/witness"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 600, 50.0, 3551.3216666666704, 23, 7020, 7016.0, 7017.0, 7019.0, 1.4069430293593839, 13.515346863117927, 0.11632927391187613], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["api\/tokenholders\u65B0", 50, 50, 100.0, 7014.859999999999, 7009, 7018, 7017.0, 7018.0, 7018.0, 0.0645460284183254, 0.1669750285938906, 0.0], "isController": false}, {"data": ["api\/account\/list  ", 50, 0, 0.0, 37.82, 23, 95, 67.0, 69.35, 95.0, 0.06512248236483177, 0.07488322317865441, 0.008967060560001251], "isController": false}, {"data": ["api\/vote\/witness\u65B0", 50, 50, 100.0, 7013.620000000002, 7009, 7019, 7017.0, 7017.0, 7019.0, 0.06454561180203602, 0.16697395084335298, 0.0], "isController": false}, {"data": ["api\/trc10trc20-transfer", 50, 0, 0.0, 101.18000000000002, 23, 1028, 195.5999999999999, 809.9499999999994, 1028.0, 0.06513486825821546, 0.6208128965899291, 0.02003660498177526], "isController": false}, {"data": ["api\/account\/list\u65B0", 50, 50, 100.0, 7014.779999999999, 7009, 7019, 7017.0, 7017.45, 7019.0, 0.06454094606700383, 0.16696188098778628, 0.0], "isController": false}, {"data": ["api\/transfer", 50, 0, 0.0, 228.76, 23, 782, 589.8, 645.1999999999998, 782.0, 0.06509950459277006, 0.2339055715411006, 0.00870960168868115], "isController": false}, {"data": ["api\/trc10trc20-transfer\u65B0", 50, 50, 100.0, 7014.9400000000005, 7009, 7020, 7016.9, 7018.0, 7020.0, 0.06457478793639643, 0.16704942699561923, 0.0], "isController": false}, {"data": ["api\/token_trc20\/transfers", 50, 0, 0.0, 160.64000000000004, 23, 2038, 695.5999999999995, 1019.4999999999991, 2038.0, 0.06513088050437353, 0.39944056644326775, 0.017618412011436983], "isController": false}, {"data": ["api\/token\u65B0", 50, 50, 100.0, 7014.759999999999, 7009, 7017, 7016.0, 7016.0, 7017.0, 0.06454636171522919, 0.16697589080433806, 0.0], "isController": false}, {"data": ["api\/token_trc20\/holders\u65B0", 50, 50, 100.0, 7015.099999999999, 7009, 7018, 7016.9, 7017.45, 7018.0, 0.06454952820749833, 0.16698408224771785, 0.0], "isController": false}, {"data": ["api\/token", 50, 0, 0.0, 24.499999999999996, 23, 27, 26.0, 26.449999999999996, 27.0, 0.06513410460797736, 0.8061643038727435, 0.008523408220184537], "isController": false}, {"data": ["api\/asset\/transfer", 50, 0, 0.0, 235.62, 23, 1172, 601.7, 863.4999999999985, 1172.0, 0.06509094506844963, 0.22296318431737824, 0.009089848774207323], "isController": false}, {"data": ["api\/account\u65B0", 50, 50, 100.0, 7015.319999999998, 7009, 7017, 7016.0, 7017.0, 7017.0, 0.06454111268878275, 0.1669623120240093, 0.0], "isController": false}, {"data": ["api\/witness\u65B0", 50, 50, 100.0, 7013.8, 7009, 7019, 7017.0, 7019.0, 7019.0, 0.06454869488993803, 0.16698192652680255, 0.0], "isController": false}, {"data": ["api\/token_trc20\u65B0", 50, 50, 100.0, 7013.560000000001, 7009, 7020, 7019.0, 7020.0, 7020.0, 0.06454636171522919, 0.16697589080433806, 0.0], "isController": false}, {"data": ["api\/vote\/witness", 50, 0, 0.0, 56.91999999999999, 46, 100, 87.9, 96.0, 100.0, 0.06512672357873951, 4.079827982413179, 0.008967644555275656], "isController": false}, {"data": ["api\/transfer\u65B0", 50, 50, 100.0, 7015.599999999999, 7009, 7020, 7017.9, 7020.0, 7020.0, 0.06451479711386604, 0.16689423589319446, 0.0], "isController": false}, {"data": ["api\/token_trc20\/transfers\u65B0", 50, 50, 100.0, 7015.38, 7009, 7019, 7017.0, 7018.0, 7019.0, 0.06454686166703888, 0.1669771841367051, 0.0], "isController": false}, {"data": ["api\/token_trc20\/holders", 50, 0, 0.0, 43.42000000000001, 23, 243, 70.5, 95.44999999999999, 243.0, 0.06513622590285321, 0.09880096828256617, 0.009414220150021756], "isController": false}, {"data": ["api\/asset\/transfer\u65B0", 50, 50, 100.0, 7015.339999999998, 7009, 7019, 7017.0, 7018.45, 7019.0, 0.06454277895389064, 0.16696662250864874, 0.0], "isController": false}, {"data": ["api\/token_trc20", 50, 0, 0.0, 37.66000000000001, 34, 49, 43.0, 45.89999999999999, 49.0, 0.0651324925162766, 1.775949354927794, 0.008904832961209691], "isController": false}, {"data": ["api\/tokenholders", 50, 0, 0.0, 47.120000000000005, 23, 172, 81.6, 135.39999999999978, 172.0, 0.0651290140639593, 0.10896007729837034, 0.011702869714617686], "isController": false}, {"data": ["api\/account", 50, 0, 0.0, 24.0, 23, 25, 25.0, 25.0, 25.0, 0.0651288443928624, 0.026842751452698876, 0.008649924645927037], "isController": false}, {"data": ["api\/witness", 50, 0, 0.0, 57.02, 46, 102, 84.9, 86.79999999999998, 102.0, 0.06513147439421216, 4.54505492130164, 0.008650273942981302], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 600, 100.0, 50.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1200, 600, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 600, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["api\/tokenholders\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["api\/vote\/witness\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["api\/account\/list\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["api\/trc10trc20-transfer\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["api\/token\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["api\/token_trc20\/holders\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["api\/account\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["api\/witness\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["api\/token_trc20\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["api\/transfer\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["api\/token_trc20\/transfers\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["api\/asset\/transfer\u65B0", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 3.17.180.46:9000 [\\\/3.17.180.46] failed: Connection timed out (Connection timed out)", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
