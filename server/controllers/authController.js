const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/emailService');
const {
  findUserByEmailOrPhone,
  findUserById,
  createFallbackUser,
  compareUserPassword,
} = require('../data/fallbackUsers');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const lowerEmail = email.toLowerCase().trim();
    let userExists = false;

    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await User.findOne({ email: lowerEmail });
        if (existing) userExists = true;
      } catch (dbErr) {
        console.warn('[Auth Controller] DB check error during registration, checking fallback.');
      }
    }

    if (!userExists) {
      const fallbackUser = findUserByEmailOrPhone(lowerEmail);
      if (fallbackUser) userExists = true;
    }

    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.create({
          name: name.trim(),
          email: lowerEmail,
          phone: phone.trim(),
          password,
        });
      } catch (dbErr) {
        console.warn('[Auth Controller] User DB creation failed, saving to fallback store.');
      }
    }

    if (!user) {
      user = await createFallbackUser({ name, email: lowerEmail, phone, password });
    }

    // Send welcome email non-blockingly
    sendWelcomeEmail(user).catch((err) => console.warn('[Welcome Email Notice]', err.message));

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your email/phone and password.' });
    }

    const lowerInput = email.toLowerCase().trim();
    let user = null;
    let isFallback = false;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({
          $or: [{ email: lowerInput }, { phone: email.trim() }],
        }).select('+password');
      } catch (dbErr) {
        console.warn('[Auth Controller] DB error during login, attempting fallback lookups.');
      }
    }

    if (!user) {
      user = findUserByEmailOrPhone(email);
      if (user) isFallback = true;
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email/password.' });
    }

    const isMatch = isFallback
      ? await compareUserPassword(password, user.password)
      : await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email/password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact customer support.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(userId);
      } catch (dbErr) {
        console.warn('[Auth Controller] DB error during getMe.');
      }
    }

    if (!user) {
      user = findUserById(userId) || req.user;
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(userId);
      } catch (dbErr) {
        console.warn('[Auth Controller] DB error during updateProfile.');
      }
    }

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      return res.json({
        success: true,
        message: 'Profile updated successfully!',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
        },
      });
    }

    const fallbackUser = findUserById(userId) || req.user;
    if (!fallbackUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    fallbackUser.name = req.body.name || fallbackUser.name;
    fallbackUser.phone = req.body.phone || fallbackUser.phone;

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        _id: fallbackUser._id,
        name: fallbackUser.name,
        email: fallbackUser.email,
        phone: fallbackUser.phone,
        role: fallbackUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};

