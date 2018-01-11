var express = require('express');
var router = express.Router();
let imgList = require('./../json/image-list.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//接口们
router.get('/imglist', function(req, res){
  res.json(imgList);
});

module.exports = router;
