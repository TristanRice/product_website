const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
	order_number: {
		type: String //although it is an order *number*, i'll actually produce a hash
	},

	products: [
		{
			product_id: {
				type: String //it is much easier to just store the id rather than the whoel product object
			},

			options: {
				category: {
					type: String
				},
				size: {
					type: String
				}
			}
		}
	],

	address: {
		type: String
	},

	postcode: {
		type: String
	},

	card_number: {
		type: String
	},

	email: {
		type: String
	}
});

module.exports = mongoose.model("Order", OrderSchema	);