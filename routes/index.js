var express = require('express');
var router 	= express.Router();
var klef		= require('../server/burger.js');
var Model 	= require('../models/index.js');


/* GET home page. */
router.get('/', function(req, res, next) {
	getBurgers(res);
});

router.post('/api/eat/:burgerate', function(req, res, next) {
	var burgerAte = req['url'].replace('/api/eat/','');
	burgerAte = decodeURI(burgerAte);
	console.log(burgerAte);
	Model.burger
		.update(
			{
				devoured: true
			},
			{
				where: {burger_name: burgerAte}
			}
		)
		.then(() => {
			getBurgers(res);
		});
});

function getBurgers(res){
	var devouredBurgers  = [];
	var availableBurgers = [];
	var thisBurger;
	var burgerName;

	Model.burger
		.findAll()
		.then(burgers => {

	  		for(var burger in burgers){
	  			thisBurger = burgers[burger].dataValues
	  			burgerName = thisBurger.burger_name
	  			if (thisBurger.devoured) {
	  				devouredBurgers.push(burgerName);
	  			}else{
	  				availableBurgers.push(burgerName);
	  			}
	  		}
  			
  			res.render('index', {devouredBurgers : devouredBurgers, availableBurgers : availableBurgers});
  		});
}

module.exports = router;