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

        // Retrieve booking data from the database
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

// Admin adding bookings
router.post('/admin_book', function (req, res) {
    if (req.session.user && req.session.user.user_type === 'admin') {
        // User is authenticated and is an admin

        // Retrieve the booking data from the form
        const { date, time, duration } = req.body;
        const bookingStatus = 'available'; // Set the booking status to 'available'

        // Insert the new booking into the database with 'available' status
        connection.query(
            "INSERT INTO drone_booking (booking_date, booking_time, booking_duration, booking_status) VALUES (?, ?, ?, ?)",
            [date, time, duration, bookingStatus],
            function (err, result) {
                if (err) {
                    throw err;
                } else {
                    // Redirect to the admin_book page to show the updated list of bookings
                    res.redirect('/admin/admin_book');
                }
            }
        );
    } else {
        // Handle unauthorized access
        res.redirect('/login');
    }
});



// Route to handle deleting bookings
router.post('/delete-booking', function (req, res) {
    const bookingId = req.body.booking_id;

    // Delete the booking from the database based on the booking ID
    connection.query("DELETE FROM drone_booking WHERE booking_id = ?", [bookingId], function (err, result) {
        if (err) {
            throw err;
        }

        // Redirect back to the admin_book page
        res.redirect('/admin/admin_book');
    });
});


// Route to handle editing bookings
router.post('/edit-booking', function (req, res) {
    if (req.session.user && req.session.user.user_type === 'admin') {
        // User is authenticated and is an admin

        // Retrieve the booking data from the form
        const { booking_id, date, time, booking_status, duration } = req.body;

        // Update the booking in the database
        connection.query(
            "UPDATE drone_booking SET booking_date=?, booking_time=?, booking_status=?, booking_duration=? WHERE booking_id=?",
            [date, time, booking_status, duration, booking_id],
            function (err, result) {
                if (err) {
                    throw err;
                } else {
                    // Redirect to the admin_book page to show the updated list of bookings
                    res.redirect('/admin/admin_book');
                }
            }
        );
    } else {
        // Handle unauthorized access
        res.redirect('/login');
    }
});


module.exports = router;
