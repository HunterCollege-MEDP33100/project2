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

})

module.exports = router;
