const login = require("./login")
	, register = require("./register")
	, router = require("express").Router( );

router.use("/", register);
router.use("/", login);

module.exports = router;