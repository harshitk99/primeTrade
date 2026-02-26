const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate({
            path: 'user',
            select: 'name email'
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate({
            path: 'user',
            select: 'name email'
        });

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Make sure user is product owner or admin
        if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'User not authorized to update this product' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Make sure user is product owner or admin
        if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'User not authorized to delete this product' });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
