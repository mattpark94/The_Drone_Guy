const express = require('express');

const router = express.Router();


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
    
router.get('/user_landing', function(req, res, next) {
     res.render('user_landing', { title: 'User Landing' });
      });


module.exports = router;