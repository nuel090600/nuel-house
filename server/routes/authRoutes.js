// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validator = require('validator');

// Input validation middleware
const validateSignupInput = (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'All fields are required',
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a valid email address',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      status: 'fail',
      message: 'Password must be at least 8 characters long',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'Passwords do not match',
    });
  }

  next();
};

// Signup route
router.post('/signup', validateSignupInput, authController.signup);

// Login route
router.post('/login', authController.login);

module.exports = router;