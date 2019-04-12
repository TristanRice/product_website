const express  = require("express")
	, auth     = require("./auth")
	, products = require("../models/product")
	, productRoutes = require("./products")
	, router   = express.Router( );

router.get("/", function(req, res) {
	products.find({}, function(err, products) {
		console.log(products);
		return res.render("index", {
			"products": products
		});
	});
});

router.use("/", auth);
router.use("/", productRoutes);

module.exports = router;