import express from 'express';
// import Stripe from 'stripe';

const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @route   POST /api/payment/create-checkout-session
// @desc    Create Stripe checkout session
// @access  Public
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { productId, productName, price, imageUrl } = req.body;

        if (!productId || !productName || !price) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName,
                            images: imageUrl ? [imageUrl] : [],
                        },
                        unit_amount: Math.round(price * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            metadata: {
                productId: productId
            }
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ message: 'Payment processing failed', error: error.message });
    }
});

// @route   POST /api/payment/webhook
// @desc    Handle Stripe webhooks
// @access  Public (Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        // TODO: Implement webhook handling after setting up Stripe
        /*
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                // TODO: Fulfill the order, send confirmation email, etc.
                console.log('Payment successful:', session);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
        */

        res.json({ message: 'Webhook endpoint - Stripe not configured' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
});

export default router;
