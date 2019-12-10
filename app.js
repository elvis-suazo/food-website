var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//mongo stuff
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// main pages
app.get('/index', function (req, res) {
  res.render('index');
});
app.get('/about', function (req, res) {
  res.render('about');
});
app.get('/give', function (req, res) {
  res.render('give');
});
/*app.get('/take', function (req, res) {
  res.render('take');
});*/

// Mongo experiment

//
var Schema = new mongoose.Schema({
  _id: String,
  name: String,
  price: Number
});

// Put here the database address you want to connect to.
target_database = 'mongodb://localhost/test';
mongoose.connect(target_database, function (err) {
  if (err) throw err;
  else console.log('*** Successfully connected to', target_database, "database ***");
});

var food_data = mongoose.model('food_data', Schema);

app.get('/take', function (req, res) {
  /*food.find({}, function (err, food) {
    if (err) res.json(err);
    else res.render('db_result', { food: food });
  });*/
  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
  
    var db = client.db('test');
  
    db.collection('food').findOne({}, function (findErr, result) {
      if (findErr) throw findErr;
      food_data = result;
      console.log(food_data.name);
      client.close();
      res.render("take",{food_results:food_data.name});
    });
    
  });


});

// This is for logging on the console the databas information.
// Only here for test purposes. It can be disabled.
MongoClient.connect(url, function (err, client) {
  if (err) throw err;

  var db = client.db('test');

  db.collection('food').findOne({}, function (findErr, result) {
    if (findErr) throw findErr;
    console.log(result.name);
    client.close();
  });
});

app.listen(3000);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
