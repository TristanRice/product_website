const product = require("../../models/product")
	, {
		check,
		validationResult
	}		  = require("express-validator/check")
	, router  = require("express").Router( );


router.post("/addReview", [

	check("rating")
		.custom(function(value, {req}) {
			//make sure that the rating is in the array
			if (["1","2","3","4","5"].indexOf(value) == -1) //the rating should only be out of 5
				throw new Error("Please enter a valid rating");
			//because teh rating should be an exact value out of 5, no more checks are needed
			return true;
		}),

	check("name")
		.exists( )
		.withMessage("Please enter your name")
		.not( ).isEmpty( )
		.withMessage("Please enter your name")
		.isLength({
			min: 2, //Nobody's name is less than 2 characters, or more than 100
			max: 100
		})
		.withMessage("Your name must be between 2 and 100 charaacters")
		.trim( ).escape( ),


	check("review")
		.exists( )
		.withMessage("Please enter a reveiw")
		.isLength({
			min:5,
			max: 500
		})
		.withMessage("Your review must be between 5 and 500 characters long")
		.trim( ).escape( ),

	check("email")
		.isEmail( )
		.withMessage("Please enter a valid email")

], 

function(req ,res) {
	let errors = validationResult(req).array( );

	if (errors.length)
		return res.redirect(`/?error=${errors[0].msg}`); //bring them back to the index page 

	let rating    = req.body.rating;
	let name      = req.body.name;
	let review 	  = req.body.review;
	let prod_name = req.body.prod_name;
	let email     = req.body.email;

	product.find({"title": prod_name}, function(err, Products) {

		if (!Products.length)
			return res.redirect("/?error=Product not found");

		let Product = Products[0]; //there should only be one product of that name


		Product.calculateNewStarRating(parseInt(rating)); //look in models/product.js for more details
		Product.reviews.push({
			"name": name,
			"email": email,
			"review": review,
			"star_rating": rating
		});
		Product.save( );

		return res.redirect("/?success=Review added");
	});
});

module.exports = router;