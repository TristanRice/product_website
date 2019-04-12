const router = require("express").Router( );

router.get("/cart", function(req, res){

	if (!req.session || !req.session.currentUser)
		return res.redirect("/login?error=You must be logged in to view that page");

	if (!req.session.shopping_cart)
		return res.render("cart", {
			"errors": [{"msg": "There is nothing in your cart"}]
		});

	console.log(req.session.shopping_cart);

	return res.render("cart", {
		"shopping_cart": req.session.shopping_cart
	});
});

router.get("/checkout", function(req, res) {
	return res.render("checkout");
});



module.exports = router;