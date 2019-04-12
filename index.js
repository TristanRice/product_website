const express    = require("express")
	, routes     = require("./routes")
	, parser     = require("body-parser")
	, cookie     = require("cookie-parser")
	, session    = require("express-session")
	, config     = require("./config.json")
	, mongoose   = require("mongoose")
	, app 	     = express( );

mongo_uri = `mongodb+srv://${config.database_username}:${config.database_password}@cluster0-uj9ge.mongodb.net/${config.database_name}?retryWrites=true`
mongoose.connect(mongo_uri);

app.use(parser.urlencoded({
	extended: true
}));

app.use(parser.json());

app.set("view engine", "pug");
app.set("views", "./views");

app.use(cookie( ));
app.use(session({
	secret: "tH1s-1S-mY-s3Cr3T",
	resave: false,
	saveUninitialized: true
}));

app.use(express.static("./public"));

app.use(routes);

app.listen(config.port, ( ) => {
	console.log(`[*] Listening on port ${config.port}`);
});