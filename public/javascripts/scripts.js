// call to leaflet for the tile
//set view is starting location
var map = L.map('map').setView([40.7678, -73.9645], 14);
document.getElementById('map')

//adds the viewable part of the map aka tile
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//the fetch function :(
fetch("https://data.cityofnewyork.us/api/v3/views/n6c5-95xh/query.json", {
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
    }});
});

//function to display kiosks with wifi status = to up then display location on button click should start the function with clearing all current markers then running previous function with if statement to check for wifi status

//function to display kiosks with tablet status = to up then display location on button click same as above but check for tablet status

//function to display all kiosks on button click, should also be default just the same function as previous

