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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4579166666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "api\/tokenholders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account\/list  "], "isController": false}, {"data": [0.0, 500, 1500, "api\/vote\/witness\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/trc10trc20-transfer"], "isController": false}, {"data": [0.0, 500, 1500, "api\/account\/list\u65B0"], "isController": false}, {"data": [0.5, 500, 1500, "api\/transfer"], "isController": false}, {"data": [0.0, 500, 1500, "api\/trc10trc20-transfer\u65B0"], "isController": false}, {"data": [0.99, 500, 1500, "api\/token_trc20\/transfers"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\/holders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token"], "isController": false}, {"data": [0.5, 500, 1500, "api\/asset\/transfer"], "isController": false}, {"data": [0.0, 500, 1500, "api\/account\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/witness\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/vote\/witness"], "isController": false}, {"data": [0.0, 500, 1500, "api\/transfer\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\/transfers\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20\/holders"], "isController": false}, {"data": [0.0, 500, 1500, "api\/asset\/transfer\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20"], "isController": false}, {"data": [1.0, 500, 1500, "api\/tokenholders"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account"], "isController": false}, {"data": [1.0, 500, 1500, "api\/witness"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 600, 50.0, 3590.1299999999965, 23, 7020, 7016.0, 7018.0, 7019.0, 1.3920661509834948, 13.179737472999717, 0.11441949971462644], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["api\/tokenholders\u65B0", 50, 50, 100.0, 7015.660000000002, 7009, 7019, 7018.0, 7018.0, 7019.0, 0.06387458098274876, 0.16523805178056783, 0.0], "isController": false}, {"data": ["api\/account\/list  ", 50, 0, 0.0, 67.56, 62, 94, 71.9, 87.79999999999998, 94.0, 0.06444312121235554, 0.057268789358636274, 0.008810582978251736], "isController": false}, {"data": ["api\/vote\/witness\u65B0", 50, 50, 100.0, 7013.619999999999, 7010, 7020, 7016.8, 7018.9, 7020.0, 0.06387352021022052, 0.16523530765319744, 0.0], "isController": false}, {"data": ["api\/trc10trc20-transfer", 50, 0, 0.0, 138.21999999999997, 33, 434, 326.9, 389.94999999999976, 434.0, 0.06443614506895956, 0.5958455641191193, 0.019758739796536428], "isController": false}, {"data": ["api\/account\/list\u65B0", 50, 50, 100.0, 7013.420000000001, 7009, 7019, 7018.0, 7019.0, 7019.0, 0.06387368340370085, 0.16523572982070658, 0.0], "isController": false}, {"data": ["api\/transfer", 50, 0, 0.0, 632.6800000000001, 541, 1004, 739.1999999999999, 838.9999999999999, 1004.0, 0.06440377560694117, 0.21255258568278307, 0.008553626447796876], "isController": false}, {"data": ["api\/trc10trc20-transfer\u65B0", 50, 50, 100.0, 7014.119999999999, 7009, 7020, 7017.9, 7019.0, 7020.0, 0.06386642210084763, 0.16521694545424354, 0.0], "isController": false}, {"data": ["api\/token_trc20\/transfers", 50, 0, 0.0, 131.92000000000002, 40, 509, 377.9, 435.14999999999986, 509.0, 0.0644178813731831, 0.3767565347109312, 0.017362632088865754], "isController": false}, {"data": ["api\/token\u65B0", 50, 50, 100.0, 7014.46, 7011, 7017, 7015.0, 7016.45, 7017.0, 0.06387474418164955, 0.16523847396209929, 0.0], "isController": false}, {"data": ["api\/token_trc20\/holders\u65B0", 50, 50, 100.0, 7013.7199999999975, 7009, 7020, 7019.0, 7019.0, 7020.0, 0.06387409139104996, 0.16523678524891733, 0.0], "isController": false}, {"data": ["api\/token", 50, 0, 0.0, 29.580000000000005, 24, 147, 30.799999999999997, 60.299999999999855, 147.0, 0.06445026501948976, 0.7794453925794542, 0.008370981687101696], "isController": false}, {"data": ["api\/asset\/transfer", 50, 0, 0.0, 621.52, 534, 874, 800.0, 854.55, 874.0, 0.06438494988919351, 0.20226934413626946, 0.008928381722915506], "isController": false}, {"data": ["api\/account\u65B0", 50, 50, 100.0, 7015.26, 7009, 7017, 7017.0, 7017.0, 7017.0, 0.06387343861379309, 0.16523509657025184, 0.0], "isController": false}, {"data": ["api\/witness\u65B0", 50, 50, 100.0, 7013.280000000001, 7011, 7020, 7015.0, 7017.9, 7020.0, 0.06387360180685646, 0.16523551873668235, 0.0], "isController": false}, {"data": ["api\/token_trc20\u65B0", 50, 50, 100.0, 7014.12, 7013, 7016, 7015.0, 7015.0, 7016.0, 0.06387482578141268, 0.16523868505367403, 0.0], "isController": false}, {"data": ["api\/vote\/witness", 50, 0, 0.0, 83.10000000000002, 81, 93, 84.0, 89.14999999999998, 93.0, 0.06444420098857405, 4.019203566342083, 0.008810730603906608], "isController": false}, {"data": ["api\/transfer\u65B0", 50, 50, 100.0, 7014.440000000001, 7009, 7019, 7018.0, 7019.0, 7019.0, 0.06387588659730598, 0.16524142929322608, 0.0], "isController": false}, {"data": ["api\/token_trc20\/transfers\u65B0", 50, 50, 100.0, 7014.599999999999, 7009, 7019, 7018.0, 7018.45, 7019.0, 0.06386160933809996, 0.16520449525061212, 0.0], "isController": false}, {"data": ["api\/token_trc20\/holders", 50, 0, 0.0, 65.3, 60, 93, 75.8, 85.14999999999998, 93.0, 0.06444602838460874, 0.07942469513806273, 0.009251529465368637], "isController": false}, {"data": ["api\/asset\/transfer\u65B0", 50, 50, 100.0, 7014.279999999999, 7009, 7019, 7018.0, 7019.0, 7019.0, 0.06385320913458468, 0.16518276464601056, 0.0], "isController": false}, {"data": ["api\/token_trc20", 50, 0, 0.0, 41.8, 40, 57, 42.0, 42.449999999999996, 57.0, 0.06444885274597227, 1.740943516300404, 0.008748428253603658], "isController": false}, {"data": ["api\/tokenholders", 50, 0, 0.0, 72.67999999999999, 69, 99, 76.8, 87.44999999999999, 99.0, 0.06444577918813785, 0.08949404102102737, 0.011517165616630104], "isController": false}, {"data": ["api\/account", 50, 0, 0.0, 23.580000000000005, 23, 27, 24.0, 25.449999999999996, 27.0, 0.0644491019662132, 0.009755479301526412, 0.008496707778748811], "isController": false}, {"data": ["api\/witness", 50, 0, 0.0, 84.19999999999999, 82, 112, 84.9, 93.04999999999995, 112.0, 0.06444411792758029, 4.479552173393988, 0.008496050703343104], "isController": false}]}, function(index, item){
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
