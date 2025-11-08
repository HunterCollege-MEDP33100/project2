async function getData(){
    const response = await fetch('/data/favorite-trees.json');
    const data = await response.json();
    console.log(data);
}

getData();