var express = require('express');
var router 	= express.Router();
var klef		= require('../server/burger.js');
var Model 	= require('../models/index.js');


/* GET home page. */
router.get('/', function(req, res, next) {
	User.burger.findAll().then(burgers => {
  		console.log(burgers)
  	});
});

module.exports = router;