const express = require('express');
const router = express.Router();
const connection = require('../drone_dbConfig'); // Import your database connection

// Standard Pages 
 router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home' });
      });
      
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About' });
    });
      
router.get('/services', function(req, res, next) {
    res.render('services', { title: 'Services' });
      });
      
router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Contact' });
      });
      
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
      });
    
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register' });
      });



// Push Register form to Database 
router.post('/register', function(req, res) {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var password = req.body.password;
  var user_type = 'user';

  // Check if the user with the provided email already exists
  var checkQuery = `SELECT * FROM drone_users WHERE user_email = "${email}"`;

  connection.query(checkQuery, function (err, results) {
      if (err) throw err;
      if (results.length > 0) {
          // User with the same email already exists
          console.log("User with this email already exists.");
          res.render('registration_failure', { title: 'Registration Failure', message: 'User with this email already exists.' });
      } else {
          // User does not exist, proceed with registration
          var sql = `INSERT INTO drone_users (user_first_name, user_last_name, user_email, user_password, user_type) VALUES ("${first_name}", "${last_name}", "${email}", "${password}", "${user_type}")`;
          connection.query(sql, function (err, result) {
              if (err) throw err;
              console.log("1 user registered");

              // Render the registration success message
              res.render('registration_success', { title: 'Registration Success' });
          });
      }
  });
});


router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.psw;
  
    // Check the database to check if the user exists and that email and password match.
    var checkQuery = `SELECT * FROM drone_users WHERE user_email = ? AND user_password = ?`; // Updated column names
    connection.query(checkQuery, [email, password], function (err, results) {
        if (err) throw err;
  
        if (results.length > 0) {
            const user = results[0];
            req.session.user = user;
  
            if (user.user_type === 'admin') {
                // Admin is authenticated
                res.redirect('/admin/admin_landing');
            } else if (user.user_type === 'user') {
                // Regular user is authenticated
                res.redirect('/user/user_landing');
            } else {
                // Invalid user type; you can render an error message on the login page
                res.render('login_failure', { title: 'Login_failure', error: 'Invalid user type' });
            }
        } else {
            // Authentication failed; you can render an error message on the login page
            res.render('login_failure', { title: 'Login_failure', error: 'Invalid credentials' });
        }
    });
  });

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
      }
      res.redirect('/login');
  });
});


module.exports = router;