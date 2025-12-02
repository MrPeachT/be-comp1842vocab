const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,         
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json({
      token,
      user: payload,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, adminCode } = req.body;

    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Email and password (min 6 chars) required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const isAdmin = adminCode && adminCode === process.env.ADMIN_CODE;
    const role = isAdmin ? 'admin' : 'student';  

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role,
    });

    return res.status(201).json({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};