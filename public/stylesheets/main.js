async function getData(){
    const response = await fetch('/api/items');
    const data = await response.json();
    console.log(data);
}

getData();