const mongoose = require("mongoose")
    , uniqueValidator = require("mongoose-unique-validator")
	, bcrypt   = require("bcryptjs")

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},

	password: {
		type: String,
		required: true
	}
});

UserSchema.verifyPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

UserSchema.hashPassword = function( ) {
	this.password = bcrypt.hashSync(this.password, 10);
}

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;