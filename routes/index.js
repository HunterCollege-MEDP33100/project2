var fs = require('fs');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', {

    });

  
});

router.get('/trees', async function(req, res){

    const response = await fetch('https://www.nycgovparks.org/tree-map-feeds/favorite-trees.json',);
    const data = await response.json();
    console.log(data);
    res.json(data);

});

router.get('/gallery', async function(req, res) {
  try {
    const response = await fetch('https://www.nycgovparks.org/tree-map-feeds/favorite-trees.json');
    const trees = await response.json();
    const limitedTrees = trees.slice(0, 20); // Limit to first 20 trees for performance

    // Send tree data to the gallery page
    res.render('gallery', { title: 'NYC Favorite Trees Gallery', trees });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading gallery');
  }
});


module.exports = router;
