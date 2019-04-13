const router = require("express").Router( )
	, products = require("../../models/product")
	, { 
		check, 
		validationResult
	} 		   = require('express-validator/check');


router.get("/addToCart", [

	check("item_quantity")
		.not( ).isEmpty( )
		.withMessage("You must enter a quantity")
		.isNumeric	( )
		.withMessage("invalid quantity value"),

	check("category")
		.not( ).isEmpty( )
		.withMessage("You must enter a category")

],

function(req, res) {
	let errors = validationResult(req).array( );

	//first make sure that they are logged in
	if (!req.session || !req.session.currentUser)
		return res.redirect("/login?error=You must be logged in to view that page");

	if (errors.length)
		return res.redirect(`/?error=${errors[0].msg}`);

	let productId = req.query.productId;
	let quantity  = req.query.item_quantity;
	let size      = req.query.size;
	let category  = req.query.category;

	products.find({"_id": productId}, function(err, Products) {
		if (!Products.length)
			return res.redirect("/?error=That product was not found")

		let Product = Products[0];
		let errors  = [];

		//helper function to search for a value in an array of objects
		let search  = (arr, value, key) => arr.find(element => element[key] === value);

		if ((!size && Product.size) || //if the user has't entered a size, but a size is needed
			//if the size has been entered, and a size is needed, but the size does not exist
			(size && Product.size && !search(Product.sizes, size, "size")))
			errors.push({"msg": "That size is not valid"});

		if (!cateogry || !search(Product.categories, category, "name")) //if the category that the user entered is not valid
			errors.push({"msg": "That category is not valid"});

		if (errors.length)
			//if any errors have been detected, we should warn the user and not go through with adding the items to the cart
			return res.render("product", {
				"errors": errors,
				"product": Product
			});
		
		//if the user doesn't already have a shopping cart saved in their session, we should make one.
		if (!req.session.shopping_cart)
			req.session.shopping_cart = [];
		
		size = size ? size: false; //we probably shouldn't be saving 'undefined' into the databse

		//we should add one product into the shopping cart for as many as the user wants
		for (let i = 0; i<parseInt(quantity); ++i) 
			req.session.shopping_cart.push({Product, options: {
				"category": category,
				"size": size
			}});
		req.session.save( );
		
		return res.redirect(`/?success=Successfully added ${Product.title} to cart`);
	});
});

module.exports = router;