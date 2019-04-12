const router = require("express").Router( )
const products = require("../../models/product");

router.get("/product/:product", function(req, res) {
	let product = req.params.product;
	products.findOne({"title": product}, function(err, Product) {
		if (!Product)
			return res.render("page_404");
		
		return res.render("product", {
			"product": Product
		});
	});
});

module.exports = router;