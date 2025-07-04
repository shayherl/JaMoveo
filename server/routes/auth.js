const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// player signup
router.post('/signup', async (req, res) => {
  const { username, password, instrument } = req.body;
  if (!username || !password || !instrument) {
    return res.status(400).json({ msg: 'Please fill all fields' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ msg: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, instrument, role: 'player' });

  await newUser.save();
  res.status(201).json({ msg: 'User created' });
});

// admin signup
router.post('/admin-signup', async (req, res) => {
  const { username, password, instrument } = req.body;
  if (!username || !password || !instrument) {
    return res.status(400).json({ msg: 'Please fill all fields' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ msg: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, instrument, role: 'admin' });

  await newUser.save();
  res.status(201).json({ msg: 'Admin user created' });
});

// login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ msg: 'Please fill all fields' });

  const user = await User.findOne({ username });
  if (!user)
    return res.status(400).json({ msg: 'Username or Password incorrect' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ msg: 'Username or Password incorrect' });

  const token = jwt.sign(
    { id: user._id, role: user.role, instrument: user.instrument },
    process.env.JWT_SECRET || 'defaultsecret',
    { expiresIn: '1h' }
  );

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
      instrument: user.instrument
    }
  });
});


module.exports = router;
