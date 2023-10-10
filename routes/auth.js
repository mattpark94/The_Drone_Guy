const express = require('express');
const authControllers = require('../controllers/auth')


const router = express.Router();


 router.post('/register', authController.register)



module.exports = router;