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
async function fetchData() {
  const response = await fetch("https://data.cityofnewyork.us/api/v3/views/n6c5-95xh/query.json", {
    headers: { "X-App-Token": "4k4VyutNPbcS7eUbG8ycYfV98" }
  });
  const data = await response.json();
  return data; // ✅ return the parsed JSON
}

fetchData();

async function displayAll() {
    markerLayerGroup.clearLayers(); 
    var data = await fetchData();
    console.log(data);
    data.forEach(item =>{
        if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude])
            .addTo(markerLayerGroup);
        }
    });
}

displayAll();

var allKiosks = document.getElementById('show-all-kiosks');

allKiosks.addEventListener('click', displayAll)

async function displayWifi() {
    markerLayerGroup.clearLayers(); 
    var data = await fetchData();
    wifiStatus = data.filter(item => (item.wifi_status === 'up'));
    console.log(wifiStatus);
    data.forEach(item =>{
        if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude])
            .addTo(markerLayerGroup);  
        }
    })
}

var wifiFilter = document.getElementById('show-wifi-up')

wifiFilter.addEventListener('click', displayWifi)

async function displayTablet() {
    markerLayerGroup.clearLayers(); 
    var data = await fetchData();
    tabletStatus = data.filter(item => (item.tablet_status === 'up'));
    console.log(tabletStatus);
    data.forEach(item =>{
        if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude])
            .addTo(markerLayerGroup);  
        }
    })    
}

var tabletFilter = document.getElementById('show-tablet-up');

tabletFilter.addEventListener('click', displayTablet);
//function to display kiosks with wifi status = to up then display location on button click should start the function with clearing all current markers then running previous function with if statement to check for wifi status
// async function fetchWifi(filterByWifiUp = false) { 
//     // clears all markers
//     markerLayerGroup.clearLayers(); 

//     const response = await fetch("https://data.cityofnewyork.us/api/v3/views/n6c5-95xh/query.json", {
//         headers: {
//             "X-App-Token": "4k4VyutNPbcS7eUbG8ycYfV98"
//         }
//     });
//     const data = await response.json();
    
//     console.log(data);
//     data.forEach(item => {
//         const shouldDisplay = !filterByWifiUp || (item.wifi_status === 'up');

//         if (item.latitude && item.longitude && shouldDisplay) {
//             L.marker([item.latitude, item.longitude])
//              .addTo(markerLayerGroup); 
//         }
//     });
// }

// // button click
// function displayWifiUpKiosks() {
//     fetchData(true); 
// }

// document.getElementById('show-wifi-up').addEventListener('click', displayWifiUpKiosks);

//function to display kiosks with tablet status = to up then display location on button click same as above but check for tablet status
// async function fetchTablet(filterByTabletUp = false) { 
//     // clears all markers
//     markerLayerGroup.clearLayers(); 

//     const response = await fetch("https://data.cityofnewyork.us/api/v3/views/n6c5-95xh/query.json", {
//         headers: {
//             "X-App-Token": "4k4VyutNPbcS7eUbG8ycYfV98"
//         }
//     });
//     const data = await response.json();
    
//     console.log(data);
//     data.forEach(item => {
//         const shouldDisplay = !filterByTabletUp || (item.tablet_status === 'up');

//         if (item.latitude && item.longitude && shouldDisplay) {
//             L.marker([item.latitude, item.longitude])
//              .addTo(markerLayerGroup); 
//         }
//     });
// }

// // button click
// function displayTabletUpKiosks() {
//     fetchData(true); 
// }

// document.getElementById('show-tablet-up').addEventListener('click', displayTabletUpKiosks);

// //function to display all kiosks on button click, should also be default just the same function as previous
// // button click
// function displayAllKiosks() {   
//     fetchData(); 
// }

// document.getElementById('show-all-kiosks').addEventListener('click', displayAllKiosks);


