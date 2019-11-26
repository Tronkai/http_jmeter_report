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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.45, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "api\/tokenholders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account\/list  "], "isController": false}, {"data": [0.0, 500, 1500, "api\/vote\/witness\u65B0"], "isController": false}, {"data": [0.94, 500, 1500, "api\/trc10trc20-transfer"], "isController": false}, {"data": [0.0, 500, 1500, "api\/account\/list\u65B0"], "isController": false}, {"data": [0.5, 500, 1500, "api\/transfer"], "isController": false}, {"data": [0.0, 500, 1500, "api\/trc10trc20-transfer\u65B0"], "isController": false}, {"data": [0.86, 500, 1500, "api\/token_trc20\/transfers"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\/holders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token"], "isController": false}, {"data": [0.5, 500, 1500, "api\/asset\/transfer"], "isController": false}, {"data": [0.0, 500, 1500, "api\/account\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/witness\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/vote\/witness"], "isController": false}, {"data": [0.0, 500, 1500, "api\/transfer\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\/transfers\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20\/holders"], "isController": false}, {"data": [0.0, 500, 1500, "api\/asset\/transfer\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20"], "isController": false}, {"data": [1.0, 500, 1500, "api\/tokenholders"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account"], "isController": false}, {"data": [1.0, 500, 1500, "api\/witness"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 600, 50.0, 3603.7975000000047, 23, 7020, 7016.0, 7017.0, 7019.0, 1.3857004946950766, 13.107861744692189, 0.11389628089534727], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["api\/tokenholders\u65B0", 50, 50, 100.0, 7015.599999999998, 7009, 7020, 7018.0, 7019.0, 7020.0, 0.06354144427161172, 0.1643762557377924, 0.0], "isController": false}, {"data": ["api\/account\/list  ", 50, 0, 0.0, 69.53999999999999, 61, 152, 86.5, 93.59999999999997, 152.0, 0.06410601596496222, 0.056969213406362906, 0.008764494370209678], "isController": false}, {"data": ["api\/vote\/witness\u65B0", 50, 50, 100.0, 7014.06, 7010, 7020, 7017.9, 7020.0, 7020.0, 0.06354305931871673, 0.16438043372585998, 0.0], "isController": false}, {"data": ["api\/trc10trc20-transfer", 50, 0, 0.0, 202.32000000000002, 33, 1926, 580.6999999999998, 984.3999999999975, 1926.0, 0.06420990990065442, 0.5937535516106414, 0.019689366903130362], "isController": false}, {"data": ["api\/account\/list\u65B0", 50, 50, 100.0, 7013.499999999999, 7009, 7018, 7017.0, 7018.0, 7018.0, 0.06354273630272776, 0.16437959811125571, 0.0], "isController": false}, {"data": ["api\/transfer", 50, 0, 0.0, 620.4599999999999, 545, 837, 722.0, 796.1999999999998, 837.0, 0.06406100657778416, 0.21131999425693077, 0.008508102436111959], "isController": false}, {"data": ["api\/trc10trc20-transfer\u65B0", 50, 50, 100.0, 7014.579999999999, 7009, 7019, 7018.0, 7019.0, 7019.0, 0.06368510010660886, 0.1647478810375067, 0.0], "isController": false}, {"data": ["api\/token_trc20\/transfers", 50, 0, 0.0, 401.46000000000004, 41, 3397, 1175.7999999999997, 3322.0999999999995, 3397.0, 0.06411489388985062, 0.36050352231198307, 0.017280967493748797], "isController": false}, {"data": ["api\/token\u65B0", 50, 50, 100.0, 7014.819999999999, 7009, 7020, 7015.9, 7017.45, 7020.0, 0.06355363990761842, 0.16440780480007933, 0.0], "isController": false}, {"data": ["api\/token_trc20\/holders\u65B0", 50, 50, 100.0, 7013.68, 7009, 7019, 7018.9, 7019.0, 7019.0, 0.06354112127204241, 0.1643754201656644, 0.0], "isController": false}, {"data": ["api\/token", 50, 0, 0.0, 35.68, 25, 180, 65.89999999999998, 130.09999999999968, 180.0, 0.06411111225086422, 0.7753437637838891, 0.00832693157164545], "isController": false}, {"data": ["api\/asset\/transfer", 50, 0, 0.0, 602.08, 535, 787, 692.7, 736.2499999999998, 787.0, 0.0640714319580614, 0.20115801705004877, 0.008884905603559297], "isController": false}, {"data": ["api\/account\u65B0", 50, 50, 100.0, 7015.879999999999, 7014, 7017, 7017.0, 7017.0, 7017.0, 0.06354289781031174, 0.1643800159174959, 0.0], "isController": false}, {"data": ["api\/witness\u65B0", 50, 50, 100.0, 7013.619999999999, 7009, 7019, 7015.0, 7019.0, 7019.0, 0.06354297856441161, 0.16438022482141246, 0.0], "isController": false}, {"data": ["api\/token_trc20\u65B0", 50, 50, 100.0, 7013.319999999999, 7009, 7015, 7014.0, 7015.0, 7015.0, 0.0635416865234437, 0.16437688242246326, 0.0], "isController": false}, {"data": ["api\/vote\/witness", 50, 0, 0.0, 83.7, 81, 113, 86.9, 97.69999999999997, 113.0, 0.06410774203557466, 3.9993715037240185, 0.008764730356426224], "isController": false}, {"data": ["api\/transfer\u65B0", 50, 50, 100.0, 7013.759999999999, 7009, 7018, 7017.0, 7017.45, 7018.0, 0.06354814725376683, 0.16439359577659016, 0.0], "isController": false}, {"data": ["api\/token_trc20\/transfers\u65B0", 50, 50, 100.0, 7013.980000000001, 7009, 7019, 7018.0, 7019.0, 7019.0, 0.06363938361438608, 0.16462961640088739, 0.0], "isController": false}, {"data": ["api\/token_trc20\/holders", 50, 0, 0.0, 77.28000000000003, 60, 350, 88.8, 214.14999999999895, 350.0, 0.0641070844739052, 0.07900697324811365, 0.009202872478187563], "isController": false}, {"data": ["api\/asset\/transfer\u65B0", 50, 50, 100.0, 7014.100000000001, 7009, 7020, 7018.9, 7019.45, 7020.0, 0.06354685500259907, 0.16439025283387199, 0.0], "isController": false}, {"data": ["api\/token_trc20", 50, 0, 0.0, 42.34000000000001, 41, 47, 43.9, 46.0, 47.0, 0.06410938599876653, 1.7325811993455713, 0.008702348294754442], "isController": false}, {"data": ["api\/tokenholders", 50, 0, 0.0, 77.77999999999999, 69, 115, 97.8, 102.24999999999997, 115.0, 0.06410667350471184, 0.089023134495801, 0.011456563722033464], "isController": false}, {"data": ["api\/account", 50, 0, 0.0, 23.539999999999996, 23, 25, 24.0, 24.0, 25.0, 0.06411267417810758, 0.009704555173444018, 0.008452354505902855], "isController": false}, {"data": ["api\/witness", 50, 0, 0.0, 84.06, 81, 94, 89.0, 93.0, 94.0, 0.06410782423173184, 4.456035945978259, 0.008451715108675583], "isController": false}]}, function(index, item){
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
