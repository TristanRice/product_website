const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
	title: {
		type: String
	},

	description: {
		type: String
	},
    /*
    For this to work I will not save each rating and the calculate the average
    after the fact, but I will save the average rating, and the amount of ratings
    that there have been. The, I will first do the number of ratings * the
    avereage rating, then i will add the current user's rating to that number,
    and then divide it by the total number + 1 for the user that just rated it.

    Example:
    where ar = average rating, nr = number of raters, nr = the new rating,
    and cr = the current user's rating

    nr = ((ar*nr)+cr)/nr+1
    */
	average_rating: {
		type: Number,
		default: 1,
		required: false
	},

	number_of_raters: {
		type: Number,
		default: 0,
		required: false
	},

	reviews: [
		{
			name: {
				type: String
			},

			email: {
				type: String
			},

			review: {
				type: String
			},

			star_rating: {
				type: Number
			}
		}
	],

	price: {
		type: Number
	},

	image: {
		type: String
	},

	categories: [
		{
			name: {
				type: String
			},

			id: {
				type: Number
			}
		}
	],
	sizes: [
		{
			size: {
				type: String
			}
		}
	]
});

ProductSchema.methods.calculateNewStarRating = function(rating) {
	let current_rating = parseInt(this.average_rating);
	let number_of_raters = parseInt(this.number_of_raters);
	
	nr = ((current_rating*number_of_raters)+rating)
		  /(number_of_raters+1)
	console.log("New Rating: "+nr)
	this.average_rating = nr;
	this.number_of_raters++;
}

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;