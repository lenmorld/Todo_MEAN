// mongoose
var mongoose = require('mongoose');
// crypto
var crypto = require('crypto');
// jsonwebtoken
var jwt = require('jsonwebtoken');


// user Model for auth
var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  salt: String
});

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
								  // pass, salt, iterations, key length
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};


UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

	return this.hash === hash;
};

// generate token
UserSchema.methods.generateJWT = function() {

	// set expiration to 60 days
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60);

	return jwt.sign({
		// payload object that gets signed, accessed by client and server
		_id: this._id,
		username: this.username,
		exp: parseInt(exp.getTime() / 1000),	// UNIX timestamp in seconds - token expiration
	}, 'SECRET');		// 2nd arg SECRET to sign tokens, better to use env. var than hardcoding
};


mongoose.model('User', UserSchema);