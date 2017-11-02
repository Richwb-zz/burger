var express = require('express');
var router 	= express.Router();
var klef		= require('../server/burger.js');
var Model 	= require('../models/index.js');


/* GET home page. */
router.get("/", function(req, res, next) {
	getBurgers(res);
});

router.post("/api/eat/:burgerate", function(req, res, next) {
	var burgerAte = decodeURI(req["url"].replace("/api/eat/",""));

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

router.post("/api/addburger", function(req,res,next) {
	var addBurger = req.body["burger-name"];
	var burgerError = "";
	
	if(addBurger === ""){
		burgerError = "Burger name cannot be blank";
		getBurgers(res, burgerError);
	}else{
		findBurger(res, addBurger);
	}
});

function getBurgers(res, burgerError=""){
	console.log("test");
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


	  			if (thisBurger.devoured > 0) {
	  				devouredBurgers.push([burgerName, thisBurger.devoured]);
	  			}

	  			if(thisBurger.count > thisBurger.devoured){
	  				var availableCount = thisBurger.count - thisBurger.devoured;
	  				
	  				availableBurgers.push([burgerName, availableCount]);
	  			}
	  		}
  			
  			res.render("index", {devouredBurgers : devouredBurgers, availableBurgers : availableBurgers, burgerError : burgerError});
  		});
}

function findBurger(res, findBurger){
	Model.burger
		.findAll({
			where: {
				burger_name: findBurger
			}
		})
		.then(burger => {
			if(burger.length === 0){
				addBurger(res, findBurger);
			}else{
				updateBurger(res, burger[0].dataValues);
			}
		});
}

function addBurger(res, addBurger){
	console.log(addBurger);
	Model.burger
		.build({
			burger_name: addBurger,
		})
		.save()
		.then(() => {
			getBurgers(res);
		});
}

function updateBurger(res, updateBurger){
	Model.burger
		.update({
			count : ++updateBurger.count
		}, {
			where: {
				id : updateBurger.id
			}
		})
		.then(() => {
			getBurgers(res);
		});
}

module.exports = router;