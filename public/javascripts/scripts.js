// call to leaflet for the tile
//set view is starting location
var map = L.map('map').setView([40.7678, -73.9645], 14);
document.getElementById('map')

//layer group that manages the markers
var markerLayerGroup = L.layerGroup().addTo(map); 

//adds the viewable part of the map aka tile
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//the fetch function
async function fetchData(){
await fetch("https://data.cityofnewyork.us/api/v3/views/n6c5-95xh/query.json", {
  headers: {
    "X-App-Token": "4k4VyutNPbcS7eUbG8ycYfV98"
  }
})
  .then(res => res.json())
    .then(data => {
        console.log(data);
        data.forEach(item => {
    // Make sure latitude and longitude exist
            if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude])
            .addTo(map)
            
    }}
  );
  return data;          
});
}

fetchData();

var jsonData = fetchData();

console.log(jsonData)

//function to display kiosks with wifi status = to up then display location on button click should start the function with clearing all current markers then running previous function with if statement to check for wifi status
async function fetchData(filterByWifiUp = false) { 
    // clears all markers
    markerLayerGroup.clearLayers(); 

    const response = await fetch("https://data.cityofnewyork.us/api/v3/views/n6c5-95xh/query.json", {
        headers: {
            "X-App-Token": "4k4VyutNPbcS7eUbG8ycYfV98"
        }
    });
    const data = await response.json();
    
    console.log(data);
    data.forEach(item => {
        const shouldDisplay = !filterByWifiUp || (item.wifi_status === 'up');

        if (item.latitude && item.longitude && shouldDisplay) {
            L.marker([item.latitude, item.longitude])
             .addTo(markerLayerGroup); 
        }
    });
    
    return data;
}

fetchData();

// button click
function displayWifiUpKiosks() {
    fetchData(true); 
}

document.getElementById('show-wifi-up').addEventListener('click', displayWifiUpKiosks);

//function to display kiosks with tablet status = to up then display location on button click same as above but check for tablet status
async function fetchData(filterByTabletUp = false) { 
    // clears all markers
    markerLayerGroup.clearLayers(); 

    const response = await fetch("https://data.cityofnewyork.us/api/v3/views/n6c5-95xh/query.json", {
        headers: {
            "X-App-Token": "4k4VyutNPbcS7eUbG8ycYfV98"
        }
    });
    const data = await response.json();
    
    console.log(data);
    data.forEach(item => {
        const shouldDisplay = !filterByTabletUp || (item.tablet_status === 'up');

        if (item.latitude && item.longitude && shouldDisplay) {
            L.marker([item.latitude, item.longitude])
             .addTo(markerLayerGroup); 
        }
    });
    
    return data;
}

fetchData();

// button click
function displayTabletUpKiosks() {
    fetchData(true); 
}

document.getElementById('show-tablet-up').addEventListener('click', displayTabletUpKiosks);

//function to display all kiosks on button click, should also be default just the same function as previous
async function fetchData() {
    // clears all markers
    markerLayerGroup.clearLayers();   

    try {
        const response = await fetch("https://data.cityofnewyork.us/api/v3/views/n6c5-95xh/query.json", {
            headers: {
                "X-App-Token": "4k4VyutNPbcS7eUbG8ycYfV98"
            }
        });
        
        const data = await response.json();
        
        console.log(data);
        
        data.forEach(item => {
            if (item.latitude && item.longitude) {
                L.marker([item.latitude, item.longitude]).addTo(markerLayerGroup); 
            }
        });
        
        return data;
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// button click
function displayAllKiosks() {   
    fetchData(); 
}

document.getElementById('show-all-kiosks').addEventListener('click', displayAllKiosks);


