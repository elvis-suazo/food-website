var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
app.get('/index',function(req,res){
  res.render('index');
});
app.get('/about',function(req,res){
  res.render('index');
});
app.get('/give',function(req,res){
  res.render('give');
});
app.get('/take',function(req,res){
  res.render('take');
});
app.get('/contacts',function(req,res){
  res.render('index');
});

MongoClient.connect(url,function(err,client){
  if(err) throw err;

  var db= client.db('test');

  db.collection('food').findOne({}, function (findErr, result) {
    if (findErr) throw findErr;
    console.log(result.name);
    client.close();
  });
});

app.listen(3000);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
