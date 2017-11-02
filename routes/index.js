var express = require('express');
var router 	= express.Router();
var klef		= require('../server/burger.js');
var Model 	= require('../models/index.js');
var Promise = require('bluebird');


// Home page get
router.get("/", function(req, res, next) {
	// run get burgers function to display all burgers on the page
	getBurgers(res);
});

// triggered by the eat button for each available burger
router.post("/api/eat/:burgerate", function(req, res, next) {
	//get the name of the burger by grabbing it's name from the url and clensing it
	var burgerAte = decodeURI(req["url"].replace("/api/eat/",""));
	// declare variable for the burger that is being ate
	var thisBurger;
	
	//query DB for a burger with that name
	Model.burger
		.findAll({
			where: {
				burger_name: burgerAte
			}
		})
		.then(burger => {
			//assign burger data values for easier manipulation
			thisBurger = burger[0].dataValues
			// Update the burgers info in DB, increase the ate count by 1 and decrease available by 1
			// Match on ID
			Model.burger
				.update({
					devoured: thisBurger.devoured + 1,
					count: thisBurger.count - 1
				},
				{
					where: {id: thisBurger.id}
				})
				.then(() => {
					// Call function to get all burger info and display it.
					getBurgers(res);
				});
		});	
});

// post to catch when a burger is added
router.post("/api/addburger", function(req,res,next) {
	//gets the burger name and stores it
	var addBurger = req.body["burger-name"];
	// place holder for possible errors
	var burgerError = "";
	
	// check if addBurger is empty, is so display error else find burger in DB
	if(addBurger === ""){
		burgerError = "Burger name cannot be blank";
		getBurgers(res, burgerError);
	}else{
		findBurger(res, addBurger);
	}
});


// Function to get the burgers and display them
function getBurgers(res, burgerError=""){
	// Gathers list of devoured burgers and the ammount
	var devouredBurgers  = [];
	// Gathers list of available burgers and the ammount
	var availableBurgers = [];
	//current burger being processed
	var thisBurger;
	// name of current burger being processed
	var burgerName;

	// query DB for all burgers
	Model.burger
		.findAll()
		.then(burgers => {

			//Loop through all the burgers in the DB
	  		for(var burger in burgers){
	  			// Assign data Values to a var for cleaner handling
	  			thisBurger = burgers[burger].dataValues
	  			// Assign burger name to its own var for easier handling
	  			burgerName = thisBurger.burger_name

	  			// if the burger has any devoured, assign that burger and its number to a nested array
	  			if (thisBurger.devoured > 0) {
	  				devouredBurgers.push([burgerName, thisBurger.devoured]);
	  			}

	  			// if the burger has any available, assign that burger and its number to a nested array
	  			if(thisBurger.count > 0){
	  				
	  				availableBurgers.push([burgerName, thisBurger.count]);
	  			}
	  		}
  			
  			// Render the index page and pass the arrays into index.pug document
  			res.render("index", {devouredBurgers : devouredBurgers, availableBurgers : availableBurgers, burgerError : burgerError});
  		});
}

// Finds burger with particular name
// if burer does not exist call add burger function
// else if it does call update burger function
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

// when a burger is input if it does not already exist create it
function addBurger(res, addBurger){
	Model.burger
		.build({
			burger_name: addBurger,
		})
		.save()
		.then(() => {
			getBurgers(res);
		});
}

// when a burger is input if it already exists update that row and increase count by 1
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