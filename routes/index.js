var express = require('express');
var router 	= express.Router();
var klef		= require('../server/burger.js');
var Model 	= require('../models/index.js');


/* GET home page. */
router.get('/', function(req, res, next) {
	var devouredBurgers  = [];
	var availableBurgers = [];
	var thisBurger;
	var burgerName;

	Model.burger.findAll().then(burgers => {
  		// console.log(burgers[0].dataValues)
  		for(var burger in burgers){
  			thisBurger = burgers[burger].dataValues
  			burgerName = thisBurger.burger_name
  			if (thisBurger.devoured) {
  				devouredBurgers.push(burgerName);
  			}else{
  				availableBurgers.push(burgerName);
  			}
  		}
  	});
});

module.exports = router;