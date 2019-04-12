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
			min: 4,
			max: 99
		})
		.withMessage("Your password must be at least 4 characters long")
		.custom(function(value, {req}) {
			//makee sure that the user has entered matching passwords
			if (value !== req.body.password2)
				throw new Error("Passwords do not match");

			return true;
		})
		.trim( ).escape( )

],
function(req, res) {

	let errors = validationResult(req).array( );

	if (errors.length)
		return res.render("register", {
			"errors": errors
		});

	let User = new user({
		email: req.body.email,
		password: req.body.password
	});	

	User.save(function(err) {
		console.log(err);
		if (err && err.errors.email)
			return res.render("auth", {
				"errors": [{"msg": "That email is already taken"}]
			});

		req.session.currentUser = user;
		req.session.save( );

		res.redirect("/");
	});
});

module.exports = router;