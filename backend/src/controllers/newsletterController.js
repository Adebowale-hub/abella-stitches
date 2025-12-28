import Newsletter from '../models/Newsletter.js';

// @desc    Subscribe email to newsletter (save to MongoDB)
// @access  Public
export const subscribeToNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });

        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return res.status(400).json({
                    message: 'This email is already subscribed to our newsletter!'
                });
            } else {
                // Reactivate inactive subscription
                existingSubscriber.isActive = true;
                existingSubscriber.subscribedAt = Date.now();
                await existingSubscriber.save();

                return res.status(200).json({
                    message: 'Successfully resubscribed! Check your inbox for confirmation.',
                    success: true
                });
            }
        }

        // Create new subscriber
        await Newsletter.create({ email });

        return res.status(201).json({
            message: 'Successfully subscribed! Check your inbox for confirmation.',
            success: true
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            message: 'Failed to subscribe. Please try again later.'
        });
    }
};

// @desc    Get newsletter statistics from MongoDB (Admin only)
// @access  Private
export const getNewsletterStats = async (req, res) => {
    try {
        // Get stats from MongoDB
        const totalSubscribers = await Newsletter.countDocuments({ isActive: true });
        const totalUnsubscribed = await Newsletter.countDocuments({ isActive: false });
        const allTimeTotal = await Newsletter.countDocuments({});

        res.json({
            totalSubscribers,
            totalUnsubscribed,
            allTimeTotal,
            subscribedCount: totalSubscribers
        });

    } catch (error) {
        console.error('Error fetching newsletter stats:', error);
        res.status(500).json({
            message: 'Failed to fetch newsletter statistics',
            error: error.message
        });
    }
};
