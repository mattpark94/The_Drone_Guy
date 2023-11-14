const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql'); 
const bcrypt = require('bcrypt');
const connection = require('./drone_dbConfig');
const app = express();

// Configure session middleware
// This code is for managing users when they login. 
app.use(session({
    secret: 'your-secret-key', // You should use a secret key for session encryption
    resave: false,            // Don't save the session on each request if not modified
    saveUninitialized: true,  // Save uninitialized sessions (e.g., new, but not modified)
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Define routes to the router folder and pages file. 
app.use('/', require('./routes/pages'));

// Define routes for user pages
app.use('/user', require('./routes/user'));

// Define routes for admin pages
app.use('/admin', require('./routes/admin'));


app.listen(3000, function () {
  console.log('Node app is running on port 3000');
});
