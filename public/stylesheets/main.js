
dataArr = [];

//this extracts the info from the favorite trees api
async function getData(){
    const response = await fetch('/trees');
    const data = await response.json();
    // topTenFavTrees(data.data);
    console.log(data);
}
getData();

//this extracts the info from the forestry trees api 
async function getForestTreeData(){
    const response = await fetch('https://data.cityofnewyork.us/resource/hn5i-inap.json');
    dataArr = await response.json();
    // addMarker(data);
    console.log(dataArr);
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


//adds markers to the map
function addMarker(info){
    //iterates through the entire forestry api and goes through the desired length of trees and adds a marker to the map
    for(let x = 0; x < info.length; x++){
        L.marker([info[x].location.coordinates[1], info[x].location.coordinates[0]]).addTo(map)
        .bindPopup(info[x].genusspecies);
    }
}




let m = [];


//adds/displays markers that have the "Excellent" structure condition in the city
function addExcellentTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of excellent
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Excellent"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor: '#255', // fill
            fillOpacity: 0.9
            }).addTo(map)
            .bindPopup(info[x].genusspecies);

            m.push(mark);
        }
    }
}

function addGoodTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of excellent
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Good"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor: '#00FF00', // fill
            fillOpacity: 0.9
            }).addTo(map);

            m.push(mark);
        }
    }
}

function addFairTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of excellent
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Fair"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor: '#FDE53B', // fill
            fillOpacity: 0.9
            }).addTo(map);
            
            m.push(mark);
        }
    }
}

function addPoorTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of excellent
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Poor"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor: '#ff8c00', // fill
            fillOpacity: 0.9
            }).addTo(map);

            m.push(mark);
        }
    }
}


function addCriticalTrees(info){
    //iterates through the entire forestry api and returns tree that have a tcondition of excellent
    for(let x = 0; x < info.length; x++){
        if(info[x].tpcondition == "Critical"){
            mark = L.circleMarker([info[x].location.coordinates[1], info[x].location.coordinates[0]], {
            radius: 8,
            color: '#333',        // stroke
            fillColor: '#8B0000', // fill
            fillOpacity: 0.9
            }).addTo(map);

            m.push(mark);
        }
    }
}



//join the TreeID & ObjectID
function joinIDs(){


}

//function that displays top 10 least favorite trees
function tenLeastFav(){

}


//function that displays the top 10 most favorite trees
function topTenFavTrees(Treeinfo){

    for(let i = 0; i < 5171; i++){
        if(Treeinfo[i].numberOfTimesFavorited >=  2){
            console.log(Treeinfo[i].numberOfTimesFavorited);
        }
    }
}

function removeMark(info){
    for(let i = 0; i < info.length; i++){
        const marker = m.pop();
        map.removeLayer(marker);
    }
}

const excellentBttn = document.getElementById("Excellent-Button");
const goodBttn = document.getElementById("Good-Button");
const fairBttn = document.getElementById("Fair-Button");
const poorBttn = document.getElementById("Poor-Button");
const criticalBttn = document.getElementById("Critical-Button");


console.log(m);
//create event listeners that once a certain button or word is clicked, it would show either data from function above 
excellentBttn.addEventListener('click', function(){
    removeMark(m);
    addExcellentTrees(dataArr);
    console.log(m);
});

goodBttn.addEventListener('click', function(){
    removeMark(m);
    addGoodTrees(dataArr);
    
console.log(m);
});

fairBttn.addEventListener('click', function(){
    removeMark(m);
    addFairTrees(dataArr);
    
console.log(m);
});

poorBttn.addEventListener('click', function(){
    removeMark(m);
    addPoorTrees(dataArr);
console.log(m);
});

criticalBttn.addEventListener('click', function(){
    removeMark(m);
    addCriticalTrees(dataArr);
console.log(m);
});
