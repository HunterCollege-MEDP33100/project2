//this extracts the info from the favorite trees api
async function getData(){
    const response = await fetch('/trees');
    const data = await response.json();
    console.log(data);
}
getData();

//this extracts the info from the forestry trees api 
async function getForestTreeData(){
    const response = await fetch('https://data.cityofnewyork.us/resource/hn5i-inap.json');
    const data = await response.json();
    console.log(data);
}
getForestTreeData();

//define a container element to load the map and provide an id for it called mymap
let map = L.map('mymap').setView([40.7128, -74.0060], 11.25)

//load and display map 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20,
    minZoom: 2,
}).addTo(map);


//function that displays top 10 least favorite trees
function tenLeastFav(){

}


//function that displays the top 10 most favorite trees
function topTenFavTrees(){

}


//create event listeners that once a certain button or word is clicked, it would show either data from function above 

