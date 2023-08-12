const express = require('express');
const bodyParser = require('body-parser');
const cart = require('./src/models/cart');
const products = require('./src/models/products');


// Create an Express app
const app = express();

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
app.use(bodyParser.json());
app.use('/cart',cart);
app.use('/products',products);
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
