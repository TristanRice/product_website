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
		return res.redirect("/login");

	if (errors.length)
		return res.redirect(`/?error=${errors[0].msg}`)

	let productId = req.query.productId;
	let quantity  = req.query.item_quantity;
	let size      = req.query.size;
	let category  = req.query.category;

	products.find({"_id": productId}, function(err, Products) {
		let Product = Products[0];
		let errors  = [];
		//searches through an array of objects
		let search  = (arr, value, key) => arr.find(element => element[key] === value);

		if (!Product)
			return res.redirect("page_404")

		if ((!size && Product.size) || 
			(size && Product.size && !search(Product.sizes, size, "size")))
			errors.push({"msg": "That size is not valid"});

		if (!search(Product.categories, category, "name"))
			errors.push({"msg": "That category is not valid"});

		console.log(errors);

		if (errors.length)
			return res.render("product", {
				"errors": errors,
				"product": Product
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
		
		return res.redirect(`/?success=Successfully added ${Product.title} to cart`);
	});
});

module.exports = router;