var express = require('express');
var path = require('path');
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



var index = require('./routes/index');
var users = require('./routes/users');

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
app.use(express.static(path.join(__dirname, 'views')));      // ADDED THIS TO make ngRoute work

app.use('/', index);
app.use('/users', users);

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

module.exports = app;
