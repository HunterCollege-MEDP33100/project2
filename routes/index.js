var fs = require('fs');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

  fs.readFile('./data/favorite-trees.json', 'utf8', function(err,data){

    if (err){
      console.log(err);
      res.statusCode = 404;
      res.send('Sorry not found');
    } 
    res.render('index', {

    });

  })
});

module.exports = router;
