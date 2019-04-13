/*
This script is only used in teh event of adding new products, update the products.json file to do this. 
*/

const products = require("./products.json")
	, Product  = require("./models/product")
	, mongoose = require("mongoose")
	, config   = require("./config.json");

mongo_uri = `mongodb+srv://${config.database_username}:${config.database_password}@cluster0-uj9ge.mongodb.net/${config.database_name}?retryWrites=true`
mongoose.connect(mongo_uri);

Product.insertMany(products)
	.then(function(mongooseDocuments) {
		console.log(mongooseDocuments);
	})
	.catch(function(err) {
		console.log(err);
	});