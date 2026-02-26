const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router
    .route('/')
    .get(getProducts)
    .post(protect, createProduct);

router
    .route('/:id')
    .get(getProduct)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
