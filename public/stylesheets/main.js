// //this extracts the info from the favorite trees api
// async function getData(){
//     const response = await fetch('/trees');
//     const data = await response.json();
//     // topTenFavTrees(data.data);
//     console.log(data);
// }
// getData();

//creates an empty array called "dataArr" that stores the information from the api & is able to be called upon universally
dataArr = [];

//this extracts the info from the forestry trees api 
async function getForestTreeData(){
    const response = await fetch('https://data.cityofnewyork.us/resource/hn5i-inap.json');
    dataArr = await response.json();
    //once the page loads up, adds all markers to the map so that it is set to view all as default 
    addAllTreeConditions(dataArr);
    console.log(dataArr);
}

//adds/displays markers that have the "Excellent" structure condition in the city
function addExcellentTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of excellent
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Excellent"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor: '#014421', // fill
            fillOpacity: 0.9
            }).addTo(map)
            .bindPopup(info[x].genusspecies);
        }
    }
}

function addGoodTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of good
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Good"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor:'#27AE60', // fill
            fillOpacity: 0.9
            }).addTo(map);
        }
    }
}

function addFairTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of fair
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Fair"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor: '#F1C40F', // fill
            fillOpacity: 0.9
            }).addTo(map);
        }
    }
}

function addPoorTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of poor
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Poor"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor: '#E67E22', // fill
            fillOpacity: 0.9
            }).addTo(map);
        }
    }
}

function addCriticalTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of critical
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Critical"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor: '#E74C3C', // fill
            fillOpacity: 0.9
            }).addTo(map);
        }
    }
}

function addDeadTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of dead
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Dead"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor: '#000', // fill
            fillOpacity: 0.9
            }).addTo(map);
        }
    }
}

//creates a map variable
let map;

//function creates a map
function createMap(){
    //define a container element to load the map and provide an id for it called mymap
    map = L.map('mymap').setView([40.7128, -74.0060], 11);

    //load and display map 
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20,
        minZoom: 2,
    }).addTo(map);
}

function addAllTreeConditions(info){
    addExcellentTrees(info);
    addFairTrees(info);
    addGoodTrees(info);
    addPoorTrees(info);
    addCriticalTrees(info);
    addDeadTrees(info);
}

//creates variables that connects to the buttons id's in the html code
const AllTreesBttn = document.getElementById("All-Trees-Button");
const excellentBttn = document.getElementById("Excellent-Button");
const goodBttn = document.getElementById("Good-Button");
const fairBttn = document.getElementById("Fair-Button");
const poorBttn = document.getElementById("Poor-Button");
const criticalBttn = document.getElementById("Critical-Button");
const deadBttn = document.getElementById('Dead-Button');

//calls upon this function to extract the information from the api
getForestTreeData();

//creates and loads the map onto the page
createMap();

//create event listeners that once a certain button or word is clicked, it would excellent data from trees or such
AllTreesBttn.addEventListener('click', function(){
    map.remove();
    createMap();
    addAllTreeConditions(dataArr);
});


//there are 10 excellent trees
excellentBttn.addEventListener('click', function(){
    map.remove();
    createMap();
    addExcellentTrees(dataArr);
});

//there are 368 good trees
goodBttn.addEventListener('click', function(){
    map.remove();
    createMap();
    addGoodTrees(dataArr);
});

//there are 334 fair trees
fairBttn.addEventListener('click', function(){
    map.remove();
    createMap();
    addFairTrees(dataArr);
});

//there are 75 poor trees
poorBttn.addEventListener('click', function(){
    map.remove();
    createMap();
    addPoorTrees(dataArr);
});

//there are 17 critical trees
criticalBttn.addEventListener('click', function(){
    map.remove();
    createMap();
    addCriticalTrees(dataArr);
});

//there are 136 dead trees 
deadBttn.addEventListener('click', function(){
    map.remove();
    createMap();
    addDeadTrees(dataArr);
})
