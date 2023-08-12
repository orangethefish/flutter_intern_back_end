const express = require('express');
// const items = require('../../miscellaneous/cart.json');
const fs = require('fs');
const path = require('path');

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
router.post('/add-to-cart', (req, res) => {
  try{
    const cartDataFilePath = path.join(__dirname, '../../miscellaneous/cart.json');
    const newCartItem = req.body;
    let cartData = [];
    if (fs.existsSync(cartDataFilePath)) {
      const cartDataString = fs.readFileSync(cartDataFilePath, 'utf8');
      cartData = JSON.parse(cartDataString);
    }
    const existingItem = cartData.filter(item => item.id === newCartItem.id);
    if(existingItem.length > 0) {
      if (cartData[existingItem].hasOwnProperty('quantity')) {
        cartData[existingItem].quantity += newCartItem.quantity;
      } else {
        cartData[existingItem].quantity = newCartItem.quantity;
      }
    }else{
      cartData.push(newCartItem);
    }
    fs.writeFileSync(cartDataFilePath, JSON.stringify(cartData));
    res.status(201).json({ message: 'Item added to cart successfully.' });
  }catch(error){
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
})
module.exports= router;