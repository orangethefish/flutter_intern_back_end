// Import required modules
const express = require('express'); // Import the Express framework
const fs = require('fs'); // Import the File System module
const path = require('path'); // Import the Path module

// Create an instance of the Express router
const router = express.Router();

// Define the path to the cart JSON file
const cartPath = '../../miscellaneous/cart.json';

// Middleware to set headers for CORS (Cross-Origin Resource Sharing)
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specified headers
  next(); // Move to the next middleware/route handler
});

// Handle GET request to retrieve all items from the cart
router.get('/all', (req, res) => {
  try {
    const cartDataFilePath = path.join(__dirname, '../../miscellaneous/cart.json');
    
    // Check if the cart data file exists
    if (fs.existsSync(cartDataFilePath)) {
      // Read and parse the cart data from the file
      const cartDataString = fs.readFileSync(cartDataFilePath, 'utf8');
      const cartData = JSON.parse(cartDataString);
      res.status(201).json(cartData); // Respond with the cart data
    } else {
      res.status(404).json({ message: 'Cart data not found.' }); // Respond with an error message
    }
  } catch (error) {
    console.error('Error retrieving cart data:', error);
    res.status(500).json({ error: 'Internal server error.' }); // Respond with an internal server error
  }
});

// Handle POST request to add an item to the cart
router.post('/add-to-cart', (req, res) => {
  try {
    const cartDataFilePath = path.join(__dirname, cartPath);
    const newCartItem = req.body; // Get the new cart item data from the request body
    let cartData = [];

    // Check if the cart data file exists
    if (fs.existsSync(cartDataFilePath)) {
      const cartDataString = fs.readFileSync(cartDataFilePath, 'utf8');
      cartData = JSON.parse(cartDataString); // Parse the existing cart data
    }

    // Find the index of the existing item with the same ID in the cart
    const existingItemIndex = cartData.findIndex(item => item.id === newCartItem.id);

    if (existingItemIndex !== -1) {
      // If the item already exists in the cart, update its quantity and subtotal
      const existingCartItem = cartData[existingItemIndex];
      existingCartItem.quantity += newCartItem.quantity;
      existingCartItem.subtotal += newCartItem.subtotal;

      if (existingCartItem.quantity <= 0) {
        cartData.splice(existingItemIndex, 1); // If quantity becomes zero or negative, remove the item from the cart
      }
    } else {
      if (newCartItem.quantity > 0) {
        cartData.push(newCartItem); // Add the new item to the cart if its quantity is positive
      }
    }

    // Write the updated cart data back to the file
    fs.writeFileSync(cartDataFilePath, JSON.stringify(cartData));
    res.status(201).json({ message: 'Item added to cart successfully.' }); // Respond with success message
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Internal server error.' }); // Respond with an internal server error
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
