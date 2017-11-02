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
	  			if (thisBurger.devoured) {
	  				devouredBurgers.push(burgerName);
	  			}else{
	  				availableBurgers.push(burgerName);
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
				// updateBurger();
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

function updateBurger(){
// 	Model.burger
// 		.update({
// 			count
// 		})
}

module.exports = router;