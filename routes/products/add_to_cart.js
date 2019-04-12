const router = require("express").Router( )
	, products = require("../../models/product");
	, { 
		check, 
		validationResult
	} 		   = require('express-validator/check');


router.get("/addToCart", [

	check.query("quantity")
		.not( ).isEmpty( )
		.withMessage("You must enter a quantity")
		.isNumber( )
		.withMessage("invalid quantity value"),

	check.query("category")
		.not( ).isEmpty( )
		.withMessage("You must enter a category")

]

function(req, res) {
	let errors = validationResult(req).array( );

	if (errors.length)
		return res.render("product", {
			"errors": errors
		});

	let productId = req.query.productId;
	let quantity  = req.query.quantity;
	let size      = req.query.size;
	let category  = req.query.category;

	products.find({"_id": productId}, function(err, Products) {
		let Product = Products[0];
		let errors  = [];
		//searches through an array of objects
		let search  = (arr, value, key) => arr.find(element => element[key] === value);

		if (!Product)
			return res.redirect("page_404")

		if ((!size && Products.size.length) || 
			(size && !search(Products.sizes, size, "size")))
			errors.push({"msg": "That size is not valid"});

		if (!search(Products.categories, category, "name"))
			errors.push({"msg": "That category is not valid"})

		if (errors.length)
			return res.render("product", {
				"errors": errors
			});
		
		if (!req.session.shopping_cart)
			req.session.shopping_cart = [];
		
		size = size ? size: false

		for (let i = 0; i<parseInt(quantity); ++i) 
			req.session.shopping_cart.push({Product, options: {
				"category": category,
				"size": size
			}});
		req.session.save( );
		
		return res.redirect("/");
	});
});

module.exports = router;