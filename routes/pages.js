const express = require('express');
const router = express.Router();
const connection = require('../drone_dbConfig'); // Import your database connection
const bcrypt = require('bcrypt');

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
router.post('/register', async function(req, res) {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var plainPassword = req.body.password; 
  var user_type = 'user';

  try {
    // Check if the user with the provided email already exists
    var checkQuery = `SELECT * FROM drone_users WHERE user_email = "${email}"`;
    const results = await connection.query(checkQuery);

    if (results.length > 0) {
      // User with the same email already exists
      console.log("User with this email already exists.");
      return res.render('registration_failure', { title: 'Registration Failure', message: 'User with this email already exists.' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // User does not exist, proceed with registration
    var sql = `INSERT INTO drone_users (user_first_name, user_last_name, user_email, user_password, user_type) VALUES (?, ?, ?, ?, ?)`;
    await connection.query(sql, [first_name, last_name, email, hashedPassword, user_type]);

    console.log("1 user registered");
    console.log("Email", email);
    console.log("Password", plainPassword);
    console.log("Hashed Password", hashedPassword );

    // Render the registration success message
    res.render('registration_success', { title: 'Registration Success' });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Login to the website with the hashed password
router.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.psw;
  console.log("Login route accessed.");

  // Check the database to find the user by email
  var checkQuery = `SELECT * FROM drone_users WHERE user_email = ?`; 
  connection.query(checkQuery, [email], async function (err, results) {
      if (err) throw err;
    
      console.log("Email:", email);
      console.log("Entered Password:", password);

      if (results.length > 0) {
          const user = results[0];
          const hashedPassword = user.user_password;

      console.log("Hashed Password", hashedPassword)

          // Compare the entered password with the hashed password from the database
          const passwordMatch = await bcrypt.compare(password, hashedPassword);

          if (passwordMatch) {
              // Passwords match, user is authenticated
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
              // Passwords don't match; render an error message on the login page
              res.render('login_failure', { title: 'Login_failure', error: 'Invalid credentials' });
          }
      } else {
          // No user found with the provided email; render an error message on the login page
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