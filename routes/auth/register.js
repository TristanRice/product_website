const router    = require("express").Router( )
	, user      = require("../../models/user")
	, {
		check,
		validationResult,
		body
	} 			= require("express-validator/check");

router.get("/register", function(req, res) {
	return res.render("register");
});

router.post("/register", [
	
	check("email")
		.isEmail( )
		.withMessage("Please enter a valid email")
		.normalizeEmail( ),

	check("password")
		.isLength({
			min: 4, //There should be very stringent password checks
			max: 99
		})
		.withMessage("Your password must be at least 4 characters long")
		.custom(function(value, {req}) {
			//makee sure that the user has entered matching passwords
			if (value !== req.body.password2)
				throw new Error("Passwords do not match"); //the error thrown will be the message that is shown to the user

			return true;
		})
		.trim( ).escape( )

],
function(req, res) {

	let errors = validationResult(req).array( );

	if (errors.length) //if any errors have been picked up by express-validator, we shouldn't go any further
		return res.render("register", {
			"errors": errors
		});

	let User = new user({
		email: req.body.email,
		password: req.body.password
	});	//make a new user object that will later be saved into the database

	User.save(function(err) {
		
		if (err && err.errors.email)
			return res.render("auth", {
				"errors": [{"msg": "That email is already taken"}]
			}); //err.errors.email will be there if the email already exists

		req.session.currentUser = user;
		req.session.save( );

		res.redirect("/");
	});
});

module.exports = router;