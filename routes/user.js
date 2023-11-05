const express = require('express');
const router = express.Router();
const connection = require('../drone_dbConfig');

// Define routes for user-specific pages

// Landing page for users
router.get('/user_landing', function (req, res) {
  if (req.session.user && req.session.user.user_type === 'user') {
    res.render('user/user_landing', { title: 'User Landing Page', user: req.session.user });
  } else {
    // Handle unauthorized access
    res.redirect('/login');
  }
});

// Import user booked data into a table
router.get('/user_landing', function (req, res) {
  if (req.session.user && req.session.user.user_type === 'user') {
    // Retrieve user data from the database
    connection.query('SELECT * FROM drone_booked WHERE user_id = ?', [req.session.user.user_id], function (err, data) {
      if (err) {
        // Throw the error instead of rendering an error page
        console.error(err);
        throw err;
      }

      res.render('user/user_landing', { title: 'User Landing Page', data: data });
    });
  } else {
    // Handle unauthorized access
    res.redirect('/login');
  }
});



// Import available bookings data into a table
router.get('/user_book', function (req, res) {
  if (req.session.user && req.session.user.user_type === 'user') {
    // Retrieve available booking data from the database
    connection.query('SELECT * FROM drone_booking', function (err, data) {
      if (err) throw err;

      res.render('user/user_book', { title: 'User Booking Page', data: data });
    });
  } else {
    // Handle unauthorized access
    res.redirect('/login');
  }
});


// Handle the booking request
router.post('/book_drone', function (req, res) {
  if (req.session.user && req.session.user.user_type === 'user') {
    // Get the booking details from the request
    const { booking_date, booking_time } = req.body;

    // Insert the booking details into the drone_booked table
    connection.query(
      'INSERT INTO drone_booked (booked_first_name, booked_last_name, booked_email, booked_date, booked_time) VALUES (?, ?, ?, ?, ?)',
      [req.session.user_first_name, req.session.user_last_name, req.session.user_email, booking_date, booking_time],
      function (err, result) {
        if (err) {
          throw err;
        }

        // Redirect to the user landing page or display a success message
        res.redirect('/user/user_landing');
      }
    );
  } else {
    // Handle unauthorized access
    res.redirect('/login');
  }
});

module.exports = router;

