var express = require('express');
var path = require('path');
var db = require('./dbConfig');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Define the route for the home page
app.get('/', function(req, res, next) {
  res.render('home', { title: 'Home' });
});

// Define the route for the about page
app.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

app.get('/book', function(req, res, next) {
  res.render('book', { title: 'Book' });
});

app.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services' });
});

app.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

app.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

app.listen(3000, function () {
  console.log('Node app is running on port 3000');
});
