const router = require('express').Router();
const auth = require('../controllers/auth');
const {db} = require('../db/db');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/UserModel'); // Assuming User model is in models/User.js


// const registerLogin = require('../controllers/authentication');
const {addIncome, getIncomes, deleteIncome} = require('../controllers/income');
const {addExpense, getExpense, deleteExpense} = require('../controllers/expense');

router.post('/add-income', auth, addIncome).get('/get-incomes', auth, getIncomes).delete('/delete-income/:id', auth, deleteIncome)
.post('/add-expense', auth, addExpense).get('/get-expenses', auth, getExpense).delete('/delete-expense/:id', auth, deleteExpense)
router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ], async (req, res) => {
    db();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { username, email, password } = req.body;
    
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      user = new User({ username, email, password });
      await user.save();
  
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, 'yourJWTSecret', { expiresIn: '1h' });
      
      res.status(201).json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });
  
  // Login route
router.post('/login', async (req, res) => {
    console.log('login backend');
    db();

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, 'yourJWTSecret', { expiresIn: '1h' }, user.username);
      
      res.json({ token , user: user.id, username:user.username});
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;