const router = require("express").Router( )
	, User   = require("../../models/user");

router.get("/login", function(req, res) {
	res.render("auth");
})

router.post("/login", function(req, res) {
	const username = req.body.username;
	const password = req.body.password;

	const redirect = req.query.nextPage ? req.query.nextPage: "/";

	User.findOne({username: username}, function(err, User) {
		if (err)
			return res.render("auth", {
				errors: {"msg": ["There was an error on our side, please try again"]}
			});

		if (!User.verifyPassword(password)) {
			return res.render("auth", {
				errors: {"msg": ["Wrong username or password"]}
			});
		}

		req.session.currentUser = User;
		req.session.save( );

		return resredirect(redirect);
	});
});

module.exports = router;