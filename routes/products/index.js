const addToCart   = require("./add_to_cart")
	, productPage = require("./product_page")
	, cart        = require("./shopping_cart")
	, addReview   = require("./add_review")
	, router      = require("express").Router( );

/*
Routes

GET /addToCart
*/
router.use("/", addToCart);

/*
Routes

GET /product/:product
*/

router.use("/", productPage);

/*

Routes

GET /cart

GET /checkout

POST /checkout
*/

router.use("/", cart);

/*
Routes

POST /addReview

*/

router.use("/", addReview);

module.exports = router;