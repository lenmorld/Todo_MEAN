var express = require('express');
var path = require('path');
var ejs = require('ejs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// mongoose
var mongoose = require('mongoose');
// require('./models/Todo');

var TodoSchema = new mongoose.Schema({
	id: Number,
	title: String,
	priority: Number,
	done: Boolean
});

mongoose.model('Todo', TodoSchema);
// other models if we have

// create /models/Todo schema, or do it directly here 

// LOCAL
mongoose.connect('mongodb://localhost/todo');            
// 'mongodb://{NEW USERNAME}:{NEW PASSWORD}@{EC2 URL}:{PORT}/{DBname}'

// REMOTE @ AWS EC2
// mongoose.connect('mongodb://lenny_todo:2049@ec2-52-70-255-80.compute-1.amazonaws.com:27017/todo'); 

// Elastic IP
// mongoose.connect('mongodb://lenny_todo:2049@52.44.44.181:27017/todo'); 



// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

//########################
// index.js

var mongoose = require('mongoose');
var Todo = mongoose.model('Todo');


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
app.get('/', function(req, res, next) {
  res.render('index', { page: 'index' });
});



// all other routes here

app.get('/todos', function(req, res, next) {
  Todo.find(function(err, todos) {
    if(err) {return next(err); }

    res.json(todos);
  });
});


app.post('/todos', function(req, res, next) {
  // console.log("post", req.body);
  var todo = new Todo(req.body);    // create mongoose Todo object 

  console.log(todo);
  todo.save(function(err, todo) {
    if(err) {return next(err); }

    res.json(todo);
  });
});


app.put('/todos/:id', function(req, res, next) {
  // console.log(req.params);
  // console.log(req.body);

  // Todo.findById(req.params.id, function(err, todo) {
  // ---> !!! this finds one by Mongoose defined _id, not our defined id

  Todo.findOne({ id: req.params.id }, function(err, todo ) {
    // console.log(todo.done);
    if(err) {
      console.log("err", err);    // -> this helped n debugging
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

//########################




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
