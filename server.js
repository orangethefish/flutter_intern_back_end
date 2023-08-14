// Import required modules
const express = require('express'); // Import the Express framework
const bodyParser = require('body-parser'); // Import body-parser for parsing request bodies
const cart = require('./src/models/cart'); // Import module to handle cart requests
const products = require('./src/models/products'); // Import module to handle products requests

// Create an instance of the Express app
const app = express();

// Define a basic route that sends a "Hello, Express!" message
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Parse the body of all requests using bodyParser middleware
app.use(bodyParser.json());

// Pass incoming requests to the respective middleware modules
app.use('/cart', cart); // Pass requests to the cart module
app.use('/products', products); // Pass requests to the products module

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
