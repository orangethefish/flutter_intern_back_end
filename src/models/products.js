const express = require('express');
const prodList = require('../../miscellaneous/products_list.json');

const router = express.Router();


const validateRouteParams = (req, res, next) => {
    const routeParamRegex = /^[a-zA-Z0-9_-]+$/;
    
    for (const param in req.params) {
      if (!req.params[param].match(routeParamRegex)) {
        return res.status(400).send('Invalid route parameter!');
      }
    }
    
    next();
};
router.get('/filter&:category', validateRouteParams, async (req, res, next) => {
    const category = req.params.category;
    if(category==='All') {
        res.status(201).json(prodList);
        return;
    }
    const item = prodList.filter(item => item.prodCategory === category);
    res.json(item);
})
router.get('/find&:id',validateRouteParams, async (req, res, next) => {
    const id= req.params.id;
    const item = prodList.filter(item => item.id == id);
    res.status(201).json(item);
})
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
router.get('/all', (req, res) => {
    res.status(201).json(prodList);
})
router.get('/category', (req, res) => {
    const prodCategory = [... new Set(prodList.map(item => item.prodCategory))];
    res.status(201).json(prodCategory);
})
module.exports = router;