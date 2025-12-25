import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';
import { sendOrderStatusEmail } from '../services/emailService.js';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders (admin only)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, email, limit = 50 } = req.query;

        // Build query
        const query = {};
        if (status) query.orderStatus = status;
        if (email) query.customerEmail = email.toLowerCase();

        const orders = await Order.find(query)
            .populate('items.productId', 'productName category imageUrl')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// @route   GET /api/orders/stats
// @desc    Get order statistics (admin only)
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
        const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

        // Calculate total revenue
        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'successful' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                totalRevenue
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Public (customer can view their own order with reference)
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId', 'productName category imageUrl');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

// @route   PUT /api/orders/:id
// @desc    Update order status (admin only)
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { orderStatus, orderNotes, trackingNumber } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update fields
        if (orderStatus) {
            const oldStatus = order.orderStatus;
            order.orderStatus = orderStatus;

            // Send status update email if status changed
            if (oldStatus !== orderStatus) {
                try {
                    await sendOrderStatusEmail({
                        customerEmail: order.customerEmail,
                        orderNumber: order.orderNumber
                    }, orderStatus);
                } catch (emailError) {
                    console.error('Status email failed (non-blocking):', emailError.message);
                }
            }
        }
        if (orderNotes !== undefined) order.orderNotes = orderNotes;
        if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

        await order.save();

        res.json({
            success: true,
            message: 'Order updated successfully',
            order
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order',
            error: error.message
        });
    }
});

export default router;
