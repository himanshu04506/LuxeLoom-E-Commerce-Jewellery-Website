const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { findUserById } = require('../data/fallbackUsers');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Authorization token required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(decoded.id);
      } catch (dbErr) {
        console.warn('[Auth Middleware] DB query error, checking fallback users.');
      }
    }

    if (!user) {
      user = findUserById(decoded.id);
    }

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User account not found or deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authorization token.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Access restricted to administrators only.' });
  }
};

module.exports = { protect, adminOnly };

