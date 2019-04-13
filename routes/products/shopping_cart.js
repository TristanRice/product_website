const router = require("express").Router( )
	, {
		check,
		validationResult
	}        = require("express-validator/check")
	, order  = require("../../models/order");

router.get("/cart", function(req, res){

	//make sure that they are logged in first
	if (!req.session || !req.session.currentUser)
		return res.redirect("/login?error=You must be logged in to view that page");

	//if they have no shopping cart, there is no reason to go any further
	if (!req.session.shopping_cart || !req.session.shopping_cart.length)
		return res.render("cart", {
			"errors": [{"msg": "There is nothing in your cart"}]
		});

	return res.render("cart", {
		"shopping_cart": req.session.shopping_cart
	});
});

router.get("/checkout", function(req, res) {
	return res.render("checkout");
});

router.post("/checkout", [

	check("address")
		.exists()
		.withMessage("Please enter an address")
		.not( ).isEmpty( )
		.withMessage("Please enter an address")
		.isLength({
			min: 1,
			max: 99
		})
		.withMessage("address too long")
		.trim( ).escape( ),

	check("zipcode")
		.exists( )
		.withMessage("Please enter a zipcode")
		.custom(function(value, {req}) {
			let re = /^[0-9]{5}(?:-[0-9]{4})?$/; //regex for matching zip codes (only for America)
			let match = re.exec(value);
			if (!match) //if there isn't a match, let them know that the Zip code isn't valid
				throw new Error("Please enter a valid zip code");

			return true;
		})
		.trim( ).escape( ),

	check("card")
		.exists( )
		.withMessage("PLease enter a card number") 
		.not( ).isEmpty( )
		.withMessage("Please enter a card number")
		//for such a small app that isn't going into production, there is no point going to the point of 
		//checking all card numbers, instead, it is easier just to ask the user for their card number
		//and let most go throguh

],

function(req, res) {
	//first make sure that they are logged in
	if (!req.session || !req.session.currentUser)
		return res.redirect("/login?error=You must be logged in to view that page");

	let errors = validationResult(req).array( );
	if (errors.length)
		return res.render("checkout", {
			"errors": errors
		});

	let address = req.body.address;
	let zipcode = req.body.zipcode;
	let card    = req.body.card;
	let email   = req.session.currentUser.email;

	//minimize the products array to just an object with the product id, and the options
	//that the product has (I don't include the full product because it is easier just to have
	//the product id, which can find the original product anyway)
	let products = [];
	req.session.shopping_cart.forEach(function(Product) {
		products.push({
			"product_id": Product.Product._id,
			"options": {
				"category": Product.options.category,
				"size": Product.options.size
			}
		});
	});

	if (!req.session.shopping_cart || !req.session.shopping_cart.length)
		return res.render("checkout", {
			"errors": [{"msg": "There is nothing in your shopping cart"}]
		});

	let ticketLength = 16;
	let ticketAlphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
	let ticketNumber = "";
	//make sure that no 2 ticket numbers will be the same (with a length of 16 and an alphabet 
	//of 57, the chances of 2 being the same are negligable.)
	for (let i = 0; i<ticketLength; ++i)
		ticketNumber+=ticketAlphabet[Math.floor(Math.random( )*ticketAlphabet.length)];



	let Order = new order({
		"order_number": ticketNumber,
		"products": products,
		"address": address,
		"postcode": zipcode,
		"card_number": card,
		"email": email
	});

	Order.save(function(err) {
		if (err)
			return res.redirect("/?error=Sorry, we had an error, please try again later");

		req.session.shopping_cart = []; //clear the shopping cart
		req.session.save( );
		
		let successMessage = `Congratulations, you have successfully placed your order, the order number is: #${ticketNumber}.
							  If you have any problems, email this number, as well as your complaint, to orders@company.com`;
		return res.redirect(`/?success=${successMessage}`)
	})
});

module.exports = router;