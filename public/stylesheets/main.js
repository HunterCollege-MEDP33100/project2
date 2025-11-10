async function getData(){
    const response = await fetch('./data/favorite-trees.json');
    const data = await response.json();
    console.log(data);
}
getData();


//function that displays top 10 least favorite trees
function tenLeastFav(){

}


//function that displays the top 10 most favorite trees
function topTenFavTrees(){

}


//create event listeners that once a certain button or word is clicked, it would show either data from function above 