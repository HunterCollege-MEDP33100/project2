var fs = require('fs');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project 2' });
    //read from the favorite-tree.json file
    const filePath = path.join(__dirname, 'public', 'data', 'items.json');
    fs.readFile(filePath, 'utf-8', function (err, data){
      if(err){
        console.log(err);
        res.statusCode = 404;
        res.send('Sorry not found');
      }
      res.end(data);
    });
});



module.exports = router;
