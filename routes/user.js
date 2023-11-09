const express = require('express');
const router = express.Router();
const connection = require('../drone_dbConfig');

// Landing page for users
router.get('/user_landing', function (req, res) {
  if (req.session.user && req.session.user.user_type === 'user') {
    // Retrieve user data from the drone_users table
    connection.query(
      'SELECT * FROM drone_users WHERE user_id = ?',
      [req.session.user.user_id],
      function (err, userData) {
        if (err) throw err;

        res.render('user/user_landing', { title: 'User Landing Page', user: userData[0] });
      }
    );
  } else {
    // Handle unauthorized access
    res.redirect('/login');
  }
});

module.exports = router;



// Import available bookings data into a table
router.get('/user_book', function (req, res) {
  if (req.session.user && req.session.user.user_type === 'user') {
    // Retrieve available booking data from the database
    connection.query('SELECT * FROM drone_booking WHERE booking_status = ?', ['available'], function (err, data) {
      if (err) throw err;

      res.render('user/user_book', { title: 'User Booking Page', data: data, user: req.session.user });
    });
  } else {
    // Handle unauthorized access
    res.redirect('/login');
  }
});

router.post('/book_drone', function (req, res) {
  if (req.session.user && req.session.user.user_type === 'user') {
    // Get the booking details from the request
    const { booking_id } = req.body;

    // Update the booking details in the drone_booking table
    connection.query(
      'UPDATE drone_booking SET booking_user_id = ?, booking_status = ? WHERE booking_id = ?',
      [req.session.user.user_id, 'booked', booking_id],
      function (err, result) {
        if (err) {
          throw err;
        }
        res.redirect('/user/user_landing');
      }
    );
  } else {
    // Handle unauthorized access
    res.redirect('/login');
  }
});

module.exports = router;
