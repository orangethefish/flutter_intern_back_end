const express = require('express');
const items = require('../../miscellaneous/cart.json');

const router = express.Router();
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
router.get('/all', (req, res) => {
   res.send('Hello, Express!');
});
module.exports= router;