const express = require('express');
const router = express.Router();
const connection = require('../drone_dbConfig');
const bcrypt = require('bcrypt');

// Landing page for users
router.get('/user_landing', function (req, res) {
  if (req.session.user && req.session.user.user_type === 'user') {
    // Retrieve user data from the drone_users table
    connection.query(
      'SELECT * FROM drone_users WHERE user_id = ?',
      [req.session.user.user_id],
      function (err, userData) {
        if (err) throw err;

        // Retrieve booking data for the user
        connection.query(
          'SELECT * FROM drone_booking WHERE booking_user_id = ?',
          [req.session.user.user_id],
          function (err, bookingData) {
            if (err) throw err;

            res.render('user/user_landing', {
              title: 'User Landing Page',
              user: userData[0],
              data: bookingData
            });
          }
        );
      }
    );
  } else {
    // Handle unauthorized access
    res.redirect('/login');
  }
});


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

// Route to handle editing users
router.post('/edit-user', async function (req, res) {
  if (req.session.user && req.session.user.user_type === 'user') {
    // User is authenticated and is a user

    // Retrieve the user data from the form
    const { user_first_name, user_last_name, user_email, user_password } = req.body;
    const user_id = req.session.user.user_id;

    // Construct the SQL query based on the provided values
    let query = "UPDATE drone_users SET ";
    const values = [];

    // Check each field and add it to the query if a value is provided
    if (user_first_name) {
      query += "user_first_name=?, ";
      values.push(user_first_name);
    }

    if (user_last_name) {
      query += "user_last_name=?, ";
      values.push(user_last_name);
    }

    if (user_email) {
      query += "user_email=?, ";
      values.push(user_email);
    }

    if (user_password) {
      const hashedPassword = await bcrypt.hash(user_password, 10);
      query += "user_password=?, ";
      values.push(hashedPassword);
    }

    // Remove the trailing comma and add the WHERE clause
    query = query.slice(0, -2); // Remove last 2 characters (comma and space)
    query += " WHERE user_id=?"; 

    // Add the user_id to the values array
    values.push(user_id);

    // Update the user in the database
    connection.query(query, values, function (err, result) {
      if (err) {
        throw err;
      } else {
        // Redirect to the user landing page to show the updated user details
        res.redirect('/user/user_landing');
      }
    });
  } else {
    // Handle unauthorized access
    res.redirect('/login');
  }
});


// Route to handle deleting bookings
router.post('/cancel-booking', function (req, res) {
  const bookingId = req.body.booking_id;

  // Cancel the booking for the user
  connection.query("UPDATE drone_booking SET booking_status=?, booking_user_id=? WHERE booking_id = ?", ["available", "0", bookingId], function (err, result) {
      if (err) {
          throw err;
      }

      // Redirect back to the admin_book page
      res.redirect('/user/user_landing');
  });
});


module.exports = router;
