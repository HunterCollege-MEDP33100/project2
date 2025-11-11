//this extracts the info from the favorite trees api
async function getData(){
    const response = await fetch('/trees');
    const data = await response.json();
    topTenFavTrees(data.data);
    console.log(data);
}
getData();

//this extracts the info from the forestry trees api 
async function getForestTreeData(){
    const response = await fetch('https://data.cityofnewyork.us/resource/hn5i-inap.json');
    const data = await response.json();
    // addMarker(data);
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


//adds markers to the map
function addMarker(info){
    //iterates through the entire forestry api and goes through the desired length of trees and adds a marker to the map
    for(let x = 0; x < info.length; x++){
        L.marker([info[x].location.coordinates[1], info[x].location.coordinates[0]]).addTo(map)
        .bindPopup(info[x].genusspecies);
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


//create event listeners that once a certain button or word is clicked, it would show either data from function above 

