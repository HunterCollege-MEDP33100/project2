var fs = require('fs');
var express = require('express');
const { parse } = require('path');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project 2' });

    //read from the favorite-tree.json file
    fs.readFile('./data/favorite-trees.json', 'utf-8', function (err, data){

      if(err){
        console.log(err);
        res.statusCode = 404;
        res.send('Sorry not found');
      }

      const trees = JSON.parse(data);
      console.log(trees);
    });


});



module.exports = router;
