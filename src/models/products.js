const express = require('express');
const prodList = require('../../miscellaneous/products_list.json');

const router = express.Router();


const validateRouteParam = (req, res, next) => {
    const routeParam = req.params.category;
    const routeParamRegex = /^[a-zA-Z0-9_-]+$/;
    if (!routeParam.match(routeParamRegex)) {
      return res.status(400).send('Invalid route parameter!');
    }
    next();
}
router.get('/filter/:category', validateRouteParam, async (req, res, next) => {
    const category = req.params.category;
    const item = prodList.filter(item => item.prodCategory === category);
    res.json(item);
})
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
router.get('/all', (req, res) => {
    res.json(prodList);
})
router.get('/category', (req, res) => {
    const prodCategory = [... new Set(prodList.map(item => item.prodCategory))];
    res.json(prodCategory);
})
module.exports = router;