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

        // Retrieve booking data with user IDs from the database using SQL JOIN
        const query = `
            SELECT b.booking_id, b.booking_date, b.booking_time, b.booking_status, b.booking_duration,
                b.booking_user_id, u.user_first_name, u.user_last_name
            FROM drone_booking b
            INNER JOIN drone_users u ON b.booking_user_id = u.user_id
        `;

        connection.query(query, function (err, data) {
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
        const book_user_id = "1"

        // Insert the new booking into the database with 'available' status
        connection.query(
            "INSERT INTO drone_booking (booking_date, booking_time, booking_duration, booking_status, booking_user_id) VALUES (?, ?, ?, ?, ?)",
            [date, time, duration, bookingStatus, book_user_id],
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


// Route to handle deleting users
router.post('/delete-user', function (req, res) {
    const userId = req.body.user_id;

    // Delete the booking from the database based on the booking ID
    connection.query("DELETE FROM drone_users WHERE user_id = ?", [userId], function (err, result) {
        if (err) {
            throw err;
        }

        // Redirect back to the admin_book page
        res.redirect('/admin/admin_users');
    });
});


// Route to handle editing users
router.post('/edit-user', function (req, res) {
    if (req.session.user && req.session.user.user_type === 'admin') {
        // User is authenticated and is an admin

        // Retrieve the user data from the form
        const { user_id, user_first_name, user_last_name, user_email, user_type } = req.body;

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

        if (user_type) {
            query += "user_type=?, ";
            values.push(user_type);
        }

        // Remove the trailing comma and add the WHERE clause
        query = query.slice(0, -2); // Remove last 2 characters (comma and space)
        query += " WHERE user_id=?"; // Assuming user_id is the primary key

        // Add the user_id to the values array
        values.push(user_id);

        // Update the user in the database
        connection.query(query, values, function (err, result) {
            if (err) {
                throw err;
            } else {
                // Redirect to the admin_users page to show the updated list of users
                res.redirect('/admin/admin_users');
            }
        });
    } else {
        // Handle unauthorized access
        res.redirect('/login');
    }
});





module.exports = router;
