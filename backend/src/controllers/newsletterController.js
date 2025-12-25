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

// @desc    Get newsletter statistics (Admin only)
// @access  Private
export const getNewsletterStats = async (req, res) => {
    try {
        const mailchimpClient = initializeMailchimp();
        if (!mailchimpClient) {
            return res.status(500).json({
                message: 'Newsletter service is not configured.'
            });
        }

        const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

        const stats = await mailchimpClient.lists.getList(audienceId);

        res.json({
            totalSubscribers: stats.stats.member_count,
            totalUnsubscribed: stats.stats.unsubscribe_count,
            totalCleaned: stats.stats.cleaned_count,
            subscribedCount: stats.stats.member_count - stats.stats.unsubscribe_count - stats.stats.cleaned_count
        });

    } catch (error) {
        console.error('Error fetching newsletter stats:', error);
        res.status(500).json({
            message: 'Failed to fetch newsletter statistics',
            error: error.message
        });
    }
};
