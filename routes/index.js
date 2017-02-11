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


router.put('/todos/:id', function(req, res, next) {
	// console.log(req.params);
	// console.log(req.body);

	// Todo.findById(req.params.id, function(err, todo) {
	// ---> !!! this finds one by Mongoose defined _id, not our defined id

	Todo.findOne({ id: req.params.id }, function(err, todo ) {
		// console.log(todo.done);
		if(err) {
			console.log("err", err);		// -> this helped n debugging
			return next(err); 
		}
		
		console.log("todo", todo);
		console.log(req.body.done);

		todo.done = req.body.done;
		todo.save(function(err) {
			if(!err) {
				res.redirect(303, '/todos');

				// 303 because of 
				// http://stackoverflow.com/questions/33214717/why-post-redirects-to-get-and-put-redirects-to-put
				// not needed for POST (redirects to GET auto)
			}
			else {
				console.log("error");
			}
		});
	});

});


module.exports = router;
