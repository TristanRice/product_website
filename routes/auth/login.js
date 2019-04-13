const router = require("express").Router( )
	, User   = require("../../models/user");

router.get("/login", function(req, res) {
	//
	if (req.query.error) {
		return res.render("login", {
			"errors": [{"msg": req.query.error}]
		});
	}

	res.render("login");
})

router.post("/login", function(req, res) {
	const email = req.body.email;
	const password = req.body.password;

	//sometimes I will want to redirect the user back to the page that they were currently on.

	const redirect = req.query.nextPage ? req.query.nextPage: "/";


	User.find({"email": email}, function(err, User) {
		if (err)
			return res.render("login", {
				errors: {"msg": ["There was an error on our side, please try again"]}
			});

		if (!User.length || User[0].password !== password) {
			return res.render("login", {
				errors: [{"msg": "Wrong email or passwordd"}]
			});
		}

		//save the user object to the session 
		req.session.currentUser = User[0];
		req.session.save( );

		return res.redirect(redirect);
	});
});

module.exports = router;