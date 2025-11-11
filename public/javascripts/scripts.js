// call to leaflet for the tile
//set view is starting location
var map = L.map('map').setView([40.8, -73.9], 11);
document.getElementById('map')

//adds the viewable part of the map aka tile
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//the parse function :(
