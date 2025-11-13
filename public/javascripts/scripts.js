// call to leaflet for the tile
//set view is starting location
var map = L.map('map').setView([40.7678, -73.9645], 14);
document.getElementById('map')

//layer group that manages the markers
var markerLayerGroup = L.layerGroup().addTo(map); 
var totalKiosksDisplayed = ''
var displayEl = document.getElementById('totalCount')
var boroEl = document.getElementById('boroughCount')


//different marker icon options
var KioskIcon = L.Icon.extend({
    options: {
        iconSize:     [20, 20],
        iconAnchor:   [10, 10], 
        popupAnchor:  [0, -10]
    }
});

var blackIcon = new KioskIcon({iconUrl: 'images/kiosk-black.png'}),
    blueIcon = new KioskIcon({iconUrl: 'images/kiosk-blue.png'}),
    grayIcon = new KioskIcon({iconUrl: 'images/kiosk-gray.png'});
    blankIcon = new KioskIcon({iconUrl: 'images/kiosk.png'});


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
    totalKiosksDisplayed = data.length
    console.log(totalKiosksDisplayed);
    manhattanKiosks = data.filter(item => (item.boro === 'Manhattan'));
    bronxKiosks = data.filter(item => (item.boro === 'Bronx'));
    brooklynKiosks = data.filter(item => (item.boro === 'Brooklyn'));
    queensKiosks = data.filter(item => (item.boro === 'Queens'));
    statenKiosks = data.filter(item => (item.boro === 'Staten Island'));
    displayEl.innerText = "There is a total of "+ totalKiosksDisplayed + " Kiosks on the map currently";
    boroEl.innerText = "There is a total of" + manhattanKiosks.length + " Kiosks in Manhattan." + " There is a total "
    data.forEach(item =>{
        if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude],{icon: blueIcon})
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
    totalKiosksDisplayed = wifiStatus.length
    console.log(totalKiosksDisplayed);
    displayEl.innerText = "There is a total of "+ totalKiosksDisplayed + " Kiosks on the map currently";
    wifiStatus.forEach(item =>{
        if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude],{icon: grayIcon})
            .addTo(markerLayerGroup);  
        }
    })
}

var wifiFilter = document.getElementById('show-wifi-up')

wifiFilter.addEventListener('click', displayWifi)

async function displayNoWifi() {
    markerLayerGroup.clearLayers(); 
    var data = await fetchData();
    wifiStatus = data.filter(item => {
    const status = item.wifi_status;
    return status === 'down' || status == null; // null or undefined
});
    totalKiosksDisplayed = wifiStatus.length
    console.log(totalKiosksDisplayed);
    displayEl.innerText = "There is a total of "+ totalKiosksDisplayed + " Kiosks on the map currently";
    wifiStatus.forEach(item =>{
        if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude],{icon: blackIcon})
            .addTo(markerLayerGroup);  
        }
    })
}

var wifiOffFilter = document.getElementById('show-wifi-down')

wifiOffFilter.addEventListener('click', displayNoWifi)

async function displayTablet() {
    markerLayerGroup.clearLayers(); 
    var data = await fetchData();
    tabletStatus = data.filter(item => (item.tablet_status === 'up'));
    totalKiosksDisplayed = tabletStatus.length
    displayEl.innerText = "There is a total of "+ totalKiosksDisplayed + " Kiosks on the map currently";
    console.log(totalKiosksDisplayed);
    tabletStatus.forEach(item =>{
        if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude],{icon: blankIcon})
            .addTo(markerLayerGroup);  
        }
    })    
}

var tabletOnFilter = document.getElementById('show-tablet-up');

tabletOnFilter.addEventListener('click', displayTablet);

async function displayNoTablet() {
    markerLayerGroup.clearLayers(); 
    var data = await fetchData();
    tabletStatus = data.filter(item => (item.tablet_status === 'down'));
    totalKiosksDisplayed = tabletStatus.length
    displayEl.innerText = "There is a total of "+ totalKiosksDisplayed + " Kiosks on the map currently";
    console.log(totalKiosksDisplayed);
    tabletStatus.forEach(item =>{
        if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude],{icon: blackIcon})
            .addTo(markerLayerGroup);  
        }
    })    
}

var tabletOffFilter = document.getElementById('show-tablet-down');

tabletOffFilter.addEventListener('click', displayNoTablet);


async function boroughDivide() {
    var data = await fetchData();
    manhattanKiosks = data.filter(item => (item.boro === 'Manhattan'));
    console.log(manhattanKiosks);
    bronxKiosks = data.filter(item => (item.boro === 'Bronx'));
    console.log(bronxKiosks);
    brooklynKiosks = data.filter(item => (item.boro === 'Brooklyn'));
    console.log(brooklynKiosks);
    queensKiosks = data.filter(item => (item.boro === 'Queens'));
    console.log(queensKiosks);
    statenKiosks = data.filter(item => (item.boro === 'Staten Island'));
    console.log(statenKiosks);
}
// boroughDivide();


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


