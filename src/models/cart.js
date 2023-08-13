const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const cartPath= '../../miscellaneous/cart.json';

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


router.get('/all', (req, res) => {
  try {
    const cartDataFilePath = path.join(__dirname, '../../miscellaneous/cart.json');
    if (fs.existsSync(cartDataFilePath)) {
      const cartDataString = fs.readFileSync(cartDataFilePath, 'utf8');
      const cartData = JSON.parse(cartDataString);
      res.status(201).json(cartData);
    } else {
      res.status(404).json({ message: 'Cart data not found.' });
    }
  } catch (error) {
    console.error('Error retrieving cart data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
})
// router.get('/total', (req, res) => {
//   try {
//     const cartDataFilePath = path.join(__dirname, '../../miscellaneous/cart.json');
//     if (fs.existsSync(cartDataFilePath)) {
//       const cartDataString = fs.readFileSync(cartDataFilePath, 'utf8');
//       const cartData = JSON.parse(cartDataString);
      
//       const total = cartData.reduce((sum, item) => sum + item.subtotal, 0);
//       const formattedTotal = total.toFixed(2); // Format total to 2 decimal places
//       res.status(201).json({ total: formattedTotal });
//     } else {
//       res.status(200).json({ total: '0.00' }); // Return total with 2 decimal places
//     }
//   } catch (error) {
//     console.error('Error calculating cart total:', error);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// })

router.post('/add-to-cart', (req, res) => {
  try {
    const cartDataFilePath = path.join(__dirname, cartPath);
    const newCartItem = req.body;
    let cartData = [];

    if (fs.existsSync(cartDataFilePath)) {
      const cartDataString = fs.readFileSync(cartDataFilePath, 'utf8');
      cartData = JSON.parse(cartDataString);
    }

    const existingItemIndex = cartData.findIndex(item => item.id === newCartItem.id);

    if (existingItemIndex !== -1) {
      const existingCartItem = cartData[existingItemIndex];
      existingCartItem.quantity += newCartItem.quantity;
      existingCartItem.subtotal += newCartItem.subtotal;
      if (existingCartItem.quantity <= 0) {
        cartData.splice(existingItemIndex, 1);
      }
    } else {
      if (newCartItem.quantity > 0) {
        cartData.push(newCartItem);
      }
    }

    fs.writeFileSync(cartDataFilePath, JSON.stringify(cartData));
    res.status(201).json({ message: 'Item added to cart successfully.' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports= router;