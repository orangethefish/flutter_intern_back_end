// Import required modules
const express = require('express'); // Import the Express framework
const prodList = require('../../miscellaneous/products_list.json'); // Import the product list data

// Create an instance of the Express router
const router = express.Router();

// Middleware to validate route parameters using regex
const validateRouteParams = (req, res, next) => {
    const routeParamRegex = /^[a-zA-Z0-9_-]+$/; // Regular expression to match valid route parameters
    
    for (const param in req.params) {
      if (!req.params[param].match(routeParamRegex)) {
        return res.status(400).send('Invalid route parameter!'); // Respond with an error for invalid parameter
      }
    }
    
    next(); // Move to the next middleware/route handler
};
// Middleware to set headers for CORS (Cross-Origin Resource Sharing)
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specified headers
    next(); // Move to the next middleware/route handler
});


// Define a route to filter products by category
router.get('/filter&:category', validateRouteParams, async (req, res, next) => {
    const category = req.params.category;
    if (category === 'All') {
        res.status(201).json(prodList); // Respond with the entire product list if category is 'All'
        return;
    }
    const filteredItems = prodList.filter(item => item.prodCategory === category); // Filter products by category
    res.json(filteredItems); // Respond with the filtered products
});

// Define a route to find a product by its ID
router.get('/find&:id', validateRouteParams, async (req, res, next) => {
    const id = req.params.id;
    const foundItem = prodList.filter(item => item.id == id); // Find product by ID
    res.status(201).json(foundItem); // Respond with the found product
});


// Define a route to get all products
router.get('/all', (req, res) => {
    res.status(201).json(prodList); // Respond with the entire product list
});

// Define a route to get unique product categories
router.get('/category', (req, res) => {
    const prodCategory = [...new Set(prodList.map(item => item.prodCategory))]; // Extract unique categories
    res.status(201).json(prodCategory); // Respond with the unique categories
});

// Export the router to be used in other parts of the application
module.exports = router;
