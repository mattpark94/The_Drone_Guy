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

// Define the route for the Website Pages
app.get('/', function(req, res, next) {
	res.render('home', { title: 'Home' });
  });
  
  app.get('/about', function(req, res, next) {
	res.render('about', { title: 'About' });
  });
  
  app.get('/user_book', function(req, res, next) {
	res.render('user_book', { title: 'Book' });
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

  app.get('/register', function(req, res, next) {
	res.render('register', { title: 'Register' });
  });

  app.get('/user_landing', function(req, res, next) {
	res.render('user_landing', { title: 'User Landing' });
  });

// Push Register form to Database 
app.post('/register', function(req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

 // Check if the user with the provided email already exists
    var checkQuery = `SELECT * FROM drone_users WHERE email = "${email}"`;

    connection.query(checkQuery, function (err, results) {
        if (err) throw err;

        if (results.length > 0) {
 // User with the same email already exists
            console.log("User with this email already exists.");
            res.render('registration_failure', { title: 'Registration Failure', message: 'User with this email already exists.' });
        } else {
 // User does not exist, proceed with registration
            var sql = `INSERT INTO drone_users (first_name, last_name, email, password) VALUES ("${first_name}", "${last_name}", "${email}","${password}")`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 user registered");

// Render the registration success message
                res.render('registration_success', { title: 'Registration Success' });
            });
        }
    });
});


//users_view page displays the database files. Just to ensure it is working, could also be used for admin viewing. 
app.get('/user_view',function(req, res) {
	connection.query("SELECT * FROM drone_users", function (err, result) {
		if (err) throw err;
		console.log(result);
		res.render('user_view', { title: 'xyz', userData: result}) ;
		});
	});

// Login Page 

app.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.psw;

// Check the database to check if the user exists and that email and password match. 
    var checkQuery = `SELECT * FROM drone_users WHERE email = ? AND password = ?`;
    connection.query(checkQuery, [email, password], function (err, results) {
        if (err) throw err;

        if (results.length > 0) {
// User is authenticated
            res.redirect('user_landing'); // Landing page for the user. 
        } else {
            // Authentication failed; you can render an error message on the login page
            res.render('login_failure', { title: 'Login_failure', error: 'Invalid credentials' });
        }
    });
});


app.listen(3000, function () {
  console.log('Node app is running on port 3000');
});
