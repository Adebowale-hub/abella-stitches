import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return res.status(400).json({ message: 'Email is already subscribed' });
            } else {
                // Reactivate subscription
                existingSubscriber.isActive = true;
                existingSubscriber.subscribedAt = Date.now();
                await existingSubscriber.save();
                return res.json({ message: 'Successfully resubscribed!' });
            }
        }

        // Create new subscriber
        await Newsletter.create({ email });
        res.status(201).json({ message: 'Successfully subscribed!' });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email is already subscribed' });
        }
        res.status(500).json({ message: 'Failed to subscribe. Please try again.' });
    }
});

// @route   GET /api/newsletter
// @desc    Get all subscribers
// @access  Private (Admin only)
router.get('/', protect, async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ isActive: true }).sort({ subscribedAt: -1 });
        res.json(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/newsletter/:email
// @desc    Unsubscribe from newsletter
// @access  Private (Admin only)
router.delete('/:email', protect, async (req, res) => {
    try {
        const subscriber = await Newsletter.findOne({ email: req.params.email });

        if (!subscriber) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        subscriber.isActive = false;
        await subscriber.save();
        res.json({ message: 'Successfully unsubscribed' });
    } catch (error) {
        console.error('Error unsubscribing:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
