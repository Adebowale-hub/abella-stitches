import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { protect } from '../middleware/auth.js';
import { subscribeToNewsletter, getNewsletterStats } from '../controllers/newsletterController.js';

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter (save to MongoDB)
// @access  Public
router.post('/subscribe', subscribeToNewsletter);

// @route   GET /api/newsletter/stats
// @desc    Get newsletter statistics from Mailchimp
// @access  Private (Admin only)
router.get('/stats', protect, getNewsletterStats);

// @route   GET /api/newsletter
// @desc    Get all subscribers from MongoDB (backup)
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
// @desc    Mark subscriber as inactive in MongoDB
// @access  Private (Admin only)
router.delete('/:email', protect, async (req, res) => {
    try {
        const subscriber = await Newsletter.findOne({ email: req.params.email });

        if (!subscriber) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        subscriber.isActive = false;
        await subscriber.save();
        res.json({ message: 'Successfully unsubscribed from local database' });
    } catch (error) {
        console.error('Error unsubscribing:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
