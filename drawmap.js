var map, heatmap, markerCluster;
var markers = [];
var addresses = [];
var log_data = [];
var heat_map_data = [];
var input = document.querySelector("input");
var visualState = {
    Empty: 1,
    Hidden: 2,
    Visible: 3
};
var heatmapState, tableState;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: 37, lng: -100},
    });

    heatmap = new google.maps.visualization.HeatmapLayer;

    markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    input.addEventListener("change", readFile);
}

function readFile() {
    // Clear all markers
    for (let i=0; i<markers.length; i++)
        markers[i].setMap(null);
    markers = [];
    heat_map_data = [];
    heatmap.setMap(null);
    heatmapState = visualState.Empty;
    markerCluster.clearMarkers();
    tableState = visualState.Empty;

    // Read file and create new markers
    if(input.files.length != 0) {
        var inputfile = input.files[0].name;
        $.get(inputfile, 
            function(data) {
                log_data = data.split(/\n/);
                for (let i=0; i<log_data.length; i++) {
                    log_data[i] = log_data[i].split(/[ ]+/);
                    addresses[i] = log_data[i][2];
                }
                locateIPs();
            },
            function(){
                alert("Error reading file!");
            }, "text");
    }
}

function locateIPs() {
    for (let n=0; n<=addresses.length/100; n++){
        var json_batch = [];
        for (let i=n*100; i<(n+1)*100 && i<addresses.length; i++)
            json_batch.push({query: addresses[i]});

        $.post("http://ip-api.com/batch/?fields=query,lat,lon,status,message", 
            JSON.stringify(json_batch), 
            function(data) {
                for (let i=0; i<data.length; i++){
                    if (data[i].status == "success") {
                        drawMarker({lat: data[i].lat, lng: data[i].lon});
                        heat_map_data.push(new google.maps.LatLng(data[i].lat, data[i].lon));
                    }else{
                        //alert("IP Geolocation API Error: " + data[i].message);
                    }
                }
            });
    }
}

function drawMarker(pos) {
    var marker;
    marker = new google.maps.Marker({
        position: pos,
        map: map
    });
    markerCluster.addMarker(marker);
}

function drawTable() {
    var table_body;
    if(tableState == visualState.Empty) {
        table_body = "<tr><td>User</td><td>Host IP</td><td>Latitude</td><td>Longitude</td></tr>";
        for (let i=0; i<heat_map_data.length; i++) {
            table_body += "<tr><td>" + log_data[i][0] + "</td><td>" + log_data[i][2] + "</td><td>" + heat_map_data[i].lat() + "</td><td>" + heat_map_data[i].lng() + "</td></tr>";
        }
        tableState = visualState.Visible;
    }
    else if(tableState == visualState.Visible) {
        table_body = "";
        tableState = visualState.Empty;
    }
    $("#results").html(table_body);
}

function drawHeatMap() {
    if (heatmapState == visualState.Empty) {
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: heat_map_data,
            dissipating: false,
            radius: 5,
            map: map
        });
        heatmapState = visualState.Visible;
    }
    else if (heatmapState == visualState.Visible) {
        heatmap.setMap(null);
        heatmapState = visualState.Hidden;
    }
    else if (heatmapState == visualState.Hidden) {
        heatmap.setMap(map);
        heatmapState = visualState.Visible;
    }
}

