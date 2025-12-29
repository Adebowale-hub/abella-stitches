import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products/categories/unique
// @desc    Get unique categories from all products
// @access  Public
router.get('/categories/unique', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/products
// @desc    Get all products (with optional filters, search, sorting, pagination)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort, page = 1, limit = 100 } = req.query;

        // Build query
        let query = {};

        // Category filter
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search by product name (case-insensitive)
        if (search) {
            query.productName = { $regex: search, $options: 'i' };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Determine sort order
        let sortOption = { createdAt: -1 }; // Default: newest first
        if (sort === 'price-asc') sortOption = { price: 1 };
        else if (sort === 'price-desc') sortOption = { price: -1 };
        else if (sort === 'name-asc') sortOption = { productName: 1 };
        else if (sort === 'newest') sortOption = { createdAt: -1 };

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination
        const products = await Product.find(query)
            .sort(sortOption)
            .limit(limitNum)
            .skip(skip);

        // Get total count for pagination metadata
        const total = await Product.countDocuments(query);

        res.json({
            products,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                limit: limitNum
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
    try {
        const { productName, category, price, imageUrl, description } = req.body;

        // Validate required fields
        if (!productName || !category) {
            return res.status(400).json({ message: 'Product name and category are required' });
        }

        const product = await Product.create({
            productName,
            category,
            price,
            imageUrl,
            description
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
    try {
        const { productName, category, price, imageUrl, description } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields
        product.productName = productName || product.productName;
        product.category = category || product.category;
        product.price = price !== undefined ? price : product.price;
        product.imageUrl = imageUrl !== undefined ? imageUrl : product.imageUrl;
        product.description = description !== undefined ? description : product.description;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
