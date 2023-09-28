var express = require('express');
var path = require('path');
var mysql = require('mysql');
var connection = require('./drone_dbConfig');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//dbRead page displays the retrieved data in an HTML table
app.get('/users_view',function(req, res) {
	connection.query("SELECT * FROM drone_users", function (err, result) {
		if (err) throw err;
		console.log(result);
		res.render('users_view', { title: 'xyz', userData: result}) ;
		});
	});

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



// Code to log into the website thingie

app.post('/', function(req, res) {
  var abcd = req.body.id;
  var bcde = req.body.email;
  var xyz = req.body.password;
  var sql = `INSERT INTO users(id,email,password) VALUES ("${abcd}", "${bcde}", "${xyz}")`;
  connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
  });
  return res.render('index', {errormessage: 'insert data successfully'});
}) ;

app.listen(3000, function () {
  console.log('Node app is running on port 3000');
});
