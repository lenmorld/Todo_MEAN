// mongoose
var mongoose = require('mongoose');

var TodoSchema = new mongoose.Schema({
	id: Number,
	author: String,
	title: String,
	priority: Number,
	done: Boolean
});


mongoose.model('Todo', TodoSchema);