var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');

// mongoose and DB models
var mongoose = require('mongoose');
var Todo = mongoose.model('Todo');
var User = mongoose.model('User');

// middleware for authenticating jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});	// we use 'payload' instead of 'user' to avoid conflicts
																// use hard-coded SECRET same as models/User.js 

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', function(req, res, next) {
  res.render('index', { page: 'index' });
});



// all other routes here

router.get('/todos', function(req, res, next) {
	Todo.find(function(err, todos) {
		if(err) {return next(err); }

		res.json(todos);
	});
});



// router.post('/todos', function(req, res, next) {

// AUTH using middleware	
router.post('/todos', auth, function(req, res, next) {
	// console.log("post", req.body);
	var todo = new Todo(req.body); 		// create mongoose Todo object 

	// set author field when creating Todo
	todo.author = req.body.payload.username;

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


// register new user
router.post('/register', function(req, res, next) {
	if(!req.body.username || !req.body.password ) {
		return res.status(400).json({
			message: 'Please fill out all fields!'
		});
	}

	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password);		// call method of User model

	user.save(function(err) {
		if(err) {return next(err); }

		return res.json({token: user.generateJWT()});		// call method of User model
	});
});


// login
router.post('/login', function(req, res, next) {
	if(!req.body.username || !req.body.password ) {
		return res.status(400).json({
			message: 'Please fill out all fields!'
		});
	}

	passport.authenticate('local', function(err, user, info) {			// passport middleware that uses LocalStrategy
		if(err) { return next(err); }									// we created earlier

		if(user) {
			return res.json({ token: user.generateJWT()});				// we use a custom callback that returns a JWT token
		} else {
			return res.status(401).json(info);			// 401 Unauthorized
		}
	})(req, res, next);
});



module.exports = router;
