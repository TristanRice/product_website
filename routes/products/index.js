const addToCart   = require("./add_to_cart")
	, productPage = require("./product_page")
	, router      = require("express").Router( );

router.use("/", addToCart);
router.use("/", productPage);

module.exports = router;