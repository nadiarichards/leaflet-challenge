var map = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
});

  
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(map);

var earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakes, function(response) {
    console.log(response);
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#ea2c2c";
            case magnitude > 4:
                return "#ea822c";
            case magnitude > 3:
                return "#ee9c00";
            case magnitude > 2:
                return "#eecc00";
            case magnitude > 1:
                return "#d4ee00";
            default: 
                return "#98ee00";
        }
    }

    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 3;
    }

    L.geoJson (response, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker (latlng);
        },
        style: styleInfo, 
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude:" + feature.properties.mag + "<br> Location:" + feature.properties.place);
        }
    }).addTo(map)

    // for (var i = 0; i < response.length; i++) {
    //     var location = response[i].location;
    
    //     if (location) {
    //       L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
    //     }
    //   }
});

var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function () {
    var div = L
        .DomUti
        .create("div", "info legend");
    var grades = [0,1,2,3,4,5];
    var color = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
    
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + color[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
};

legend.addTo(map);