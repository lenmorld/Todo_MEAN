var express = require('express');
var router = express.Router();

// mongoose and DB models
var mongoose = require('mongoose');
var Todo = mongoose.model('Todo');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// all other routes here

router.get('/todos', function(req, res, next) {
	Todo.find(function(err, todos) {
		if(err) {return next(err); }

		res.json(todos);
	});
});


router.post('/todos', function(req, res, next) {
	// console.log("post", req.body);
	var todo = new Todo(req.body); 		// create mongoose Todo object 

	console.log(todo);
	todo.save(function(err, todo) {
		if(err) {return next(err); }

		res.json(todo);
	});
});




module.exports = router;
