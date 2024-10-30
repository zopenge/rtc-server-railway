const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// replace the hardcoded JWT_SECRET with environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // create new user
    user = new User({
      username,
      email,
      password
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // create jwt token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 