const express  = require("express")
	, auth     = require("./auth")
	, products = require("../models/product")
	, productRoutes = require("./products")
	, router   = express.Router( );

router.get("/", function(req, res) {
	console.log(req.session)
	let errors = [];
	let success = [];
	if (req.query.error)
		errors.push({"msg": req.query.error});
	else if (req.query.success)
		success.push({"msg": req.query.success});
	products.find({}, function(err, products) {
		return res.render("index", {
			"products": products,
			"errors": errors,
			"success": success
		});
	});
});

router.use("/", auth);
router.use("/", productRoutes);

module.exports = router;