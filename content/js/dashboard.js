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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7888125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8, 500, 1500, "api\/tokenholders\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account\/list  "], "isController": false}, {"data": [0.9775, 500, 1500, "api\/vote\/witness\u65B0"], "isController": false}, {"data": [0.979, 500, 1500, "api\/trc10trc20-transfer"], "isController": false}, {"data": [0.928, 500, 1500, "api\/account\/list\u65B0"], "isController": false}, {"data": [0.5, 500, 1500, "api\/transfer"], "isController": false}, {"data": [0.5555, 500, 1500, "api\/trc10trc20-transfer\u65B0"], "isController": false}, {"data": [0.985, 500, 1500, "api\/token_trc20\/transfers"], "isController": false}, {"data": [0.9795, 500, 1500, "api\/token\u65B0"], "isController": false}, {"data": [0.3475, 500, 1500, "api\/token_trc20\/holders\u65B0"], "isController": false}, {"data": [0.9995, 500, 1500, "api\/token"], "isController": false}, {"data": [0.4985, 500, 1500, "api\/asset\/transfer"], "isController": false}, {"data": [0.9975, 500, 1500, "api\/account\u65B0"], "isController": false}, {"data": [0.948, 500, 1500, "api\/witness\u65B0"], "isController": false}, {"data": [0.8895, 500, 1500, "api\/token_trc20\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/vote\/witness"], "isController": false}, {"data": [0.389, 500, 1500, "api\/transfer\u65B0"], "isController": false}, {"data": [0.0, 500, 1500, "api\/token_trc20\/transfers\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20\/holders"], "isController": false}, {"data": [0.158, 500, 1500, "api\/asset\/transfer\u65B0"], "isController": false}, {"data": [1.0, 500, 1500, "api\/token_trc20"], "isController": false}, {"data": [0.9995, 500, 1500, "api\/tokenholders"], "isController": false}, {"data": [1.0, 500, 1500, "api\/account"], "isController": false}, {"data": [1.0, 500, 1500, "api\/witness"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24000, 0, 0.0, 724.3633333333314, 0, 19514, 2011.5000000000073, 4296.650000000005, 8368.94000000001, 6.824424615699589, 106.91527893369431, 1.1151891787373676], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["api\/tokenholders\u65B0", 1000, 0, 0.0, 523.9880000000003, 27, 13729, 1344.5, 2291.1499999999987, 4352.310000000001, 0.28514790051303807, 0.37982591435525775, 0.05040211913365224], "isController": false}, {"data": ["api\/account\/list  ", 1000, 0, 0.0, 59.945999999999984, 49, 170, 71.0, 82.0, 99.0, 0.2851448107921608, 0.2534001736531898, 0.038984642100490734], "isController": false}, {"data": ["api\/vote\/witness\u65B0", 1000, 0, 0.0, 85.834, 18, 3104, 216.69999999999993, 446.1999999999989, 1160.800000000001, 0.2851543240944283, 17.919298782170042, 0.03842900070803819], "isController": false}, {"data": ["api\/trc10trc20-transfer", 1000, 0, 0.0, 97.87899999999993, 32, 2264, 169.89999999999998, 430.0499999999987, 1028.98, 0.28587715401288616, 2.64352614389455, 0.08766154917973269], "isController": false}, {"data": ["api\/account\/list\u65B0", 1000, 0, 0.0, 249.22100000000012, 16, 5546, 539.9, 1181.199999999999, 3695.790000000001, 0.2851512342343447, 0.3358324106314646, 0.03842858430111286], "isController": false}, {"data": ["api\/transfer", 1000, 0, 0.0, 615.6240000000008, 529, 1241, 697.9, 755.0, 936.7200000000003, 0.28515107161198466, 0.9390308825382894, 0.037871626698466714], "isController": false}, {"data": ["api\/trc10trc20-transfer\u65B0", 1000, 0, 0.0, 1459.284999999999, 40, 19380, 3774.6, 4851.9, 8677.620000000003, 0.2858843460595703, 3.4482007404118677, 0.08710538669002532], "isController": false}, {"data": ["api\/token_trc20\/transfers", 1000, 0, 0.0, 94.382, 29, 4660, 116.69999999999993, 209.94999999999993, 1189.99, 0.285289204799135, 1.6653264203301366, 0.07689435598101685], "isController": false}, {"data": ["api\/token\u65B0", 1000, 0, 0.0, 113.65199999999983, 26, 7499, 68.0, 102.94999999999993, 2952.8100000000004, 0.28519523039496686, 3.459207590399758, 0.03648493670091862], "isController": false}, {"data": ["api\/token_trc20\/holders\u65B0", 1000, 0, 0.0, 1479.4919999999977, 829, 6080, 2034.5, 2336.8999999999987, 3343.5600000000004, 0.28508018592929724, 0.3304591608379647, 0.040367799765379006], "isController": false}, {"data": ["api\/token", 1000, 0, 0.0, 19.992000000000022, 12, 584, 25.0, 41.94999999999993, 148.98000000000002, 0.2851965317820163, 3.4440823359535293, 0.037042127663093914], "isController": false}, {"data": ["api\/asset\/transfer", 1000, 0, 0.0, 606.727, 519, 2104, 675.9, 740.7999999999997, 968.99, 0.28519661311910127, 0.8935148616311592, 0.039548749084875365], "isController": false}, {"data": ["api\/account\u65B0", 1000, 0, 0.0, 6.419999999999996, 0, 2165, 1.0, 1.0, 3.980000000000018, 0.2851557877357347, 0.023948630610618346, 0.03703683571177023], "isController": false}, {"data": ["api\/witness\u65B0", 1000, 0, 0.0, 152.45099999999996, 31, 4015, 401.9, 895.0, 1932.8600000000001, 0.28515424278146295, 19.93837172988679, 0.03703663504876423], "isController": false}, {"data": ["api\/token_trc20\u65B0", 1000, 0, 0.0, 323.2059999999998, 14, 19514, 835.3999999999999, 1638.949999999997, 4034.290000000002, 0.2851962064341405, 2.1286666072032574, 0.038156133087380126], "isController": false}, {"data": ["api\/vote\/witness", 1000, 0, 0.0, 72.61599999999997, 58, 297, 79.0, 84.0, 108.99000000000001, 0.28515017719232005, 17.77754884203721, 0.03898537578801251], "isController": false}, {"data": ["api\/transfer\u65B0", 1000, 0, 0.0, 1365.197, 310, 7249, 2543.3999999999996, 3168.499999999999, 4971.42, 0.2851676600482104, 0.9864186072504163, 0.037316861764121294], "isController": false}, {"data": ["api\/token_trc20\/transfers\u65B0", 1000, 0, 0.0, 7061.506999999991, 2117, 18535, 10016.6, 11524.249999999987, 15085.890000000003, 0.28523761291487454, 1.4774416981450142, 0.07632334564323791], "isController": false}, {"data": ["api\/token_trc20\/holders", 1000, 0, 0.0, 60.613000000000014, 49, 437, 76.0, 93.0, 173.93000000000006, 0.28515440540744, 0.35143052697674737, 0.04093525155751336], "isController": false}, {"data": ["api\/asset\/transfer\u65B0", 1000, 0, 0.0, 2756.6819999999993, 349, 10432, 5069.3, 5699.749999999997, 7220.350000000001, 0.28505141900021636, 0.8688801509147728, 0.03897187369143583], "isController": false}, {"data": ["api\/token_trc20", 1000, 0, 0.0, 33.082999999999984, 28, 78, 42.0, 42.0, 50.98000000000002, 0.2851941730267344, 7.7080409498905285, 0.038712880908902424], "isController": false}, {"data": ["api\/tokenholders", 1000, 0, 0.0, 75.72699999999992, 57, 627, 91.0, 106.89999999999986, 225.99, 0.28514180244406445, 0.3887284728631972, 0.050957958835218545], "isController": false}, {"data": ["api\/account", 1000, 0, 0.0, 12.280999999999992, 11, 25, 12.0, 23.0, 24.0, 0.2851548119731943, 0.04316308189047374, 0.037593651969122295], "isController": false}, {"data": ["api\/witness", 1000, 0, 0.0, 58.915000000000006, 46, 143, 71.0, 82.0, 93.99000000000001, 0.28515212866064044, 19.831389880485613, 0.03759329821209615], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24000, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
