const express = require('express');
const router = express.Router();
const connection = require('../drone_dbConfig'); // Import your database connection

// Define routes for admin-specific pages

// Landing page for admin
router.get('/admin_landing', (req, res) => {
    if (req.session.user && req.session.user.user_type === 'admin') {
        // User is authenticated and is an admin
        res.render('admin/admin_landing');
    } else {
        // Handle unauthorized access
        res.redirect('/login');
    }
});

// Add a route for admin_users
router.get('/admin_users', function (req, res) {
    if (req.session.user && req.session.user.user_type === 'admin') {
        // User is authenticated and is an admin

        // Retrieve user data from the database
        connection.query("SELECT * FROM drone_users", function (err, data) {
            if (err) {
                throw err;
              }

            res.render('admin/admin_users', { title: 'Admin Users Page', data: data });
        });
    } else {
        // Handle unauthorized access
        res.redirect('/login');
    }
});

// Admin_book page
router.get('/admin_book', function (req, res) {
    if (req.session.user && req.session.user.user_type === 'admin') {
        // User is authenticated and is an admin

        // Retrieve user data from the database
        connection.query("SELECT * FROM drone_booking", function (err, data) {
            if (err) {
                throw err;
              }

            res.render('admin/admin_book', { title: 'Admin Booking Page', data: data });
        });
    } else {
        // Handle unauthorized access
        res.redirect('/login');
    }
});


// Add a new POST route for adding bookings
router.post('/admin_book', function (req, res) {
    if (req.session.user && req.session.user.user_type === 'admin') {
        // User is authenticated and is an admin

        // Retrieve the booking data from the form
        const { date, time, duration } = req.body;

        // Insert the new booking into the database
        connection.query("INSERT INTO drone_booking (booking_date, booking_time, booking_duration) VALUES (?, ?, ?)", [date, time, duration], function (err, result) {
            if (err) {
                throw err;
              }

            // Redirect to the admin_book page to show the updated list of bookings
            res.redirect('/admin/admin_book');
        });
    } else {
        // Handle unauthorized access
        res.redirect('/login');
    }
});

module.exports = router;
