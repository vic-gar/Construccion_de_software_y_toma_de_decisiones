const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products.controller');

router.get('/products', productsController.products);
router.post('/add_product', productsController.add_product);
router.get('/prepare_million_products', productsController.prepare_million_products);

module.exports = router;