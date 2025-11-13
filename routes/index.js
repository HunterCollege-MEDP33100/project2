var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', 
    { 
      title: 'Anime Explorer - Discover Amazing Anime', 
      h1: 'Anime Explorer',
    });
});

module.exports = router;
