import express from 'express';
import https from 'https';

const router = express.Router();

// Helper function to make Paystack API calls
const paystackRequest = (path, method, data = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: path,
            method: method,
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);
                    resolve(parsedData);
                } catch (error) {
                    reject(new Error('Failed to parse response'));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
};

// @route   POST /api/payment/initialize
// @desc    Initialize Paystack payment
// @access  Public
router.post('/initialize', async (req, res) => {
    try {
        const { email, amount, productId, productName } = req.body;

        if (!email || !amount || !productId || !productName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Paystack expects amount in kobo (smallest currency unit)
        const amountInKobo = Math.round(amount * 100);

        const paymentData = {
            email,
            amount: amountInKobo,
            currency: 'NGN',
            metadata: {
                productId,
                productName,
                custom_fields: [
                    {
                        display_name: 'Product Name',
                        variable_name: 'product_name',
                        value: productName
                    }
                ]
            },
            callback_url: `${process.env.FRONTEND_URL}/payment/success`
        };

        const response = await paystackRequest('/transaction/initialize', 'POST', paymentData);

        if (response.status) {
            res.json({
                status: true,
                message: 'Payment initialized',
                data: {
                    authorization_url: response.data.authorization_url,
                    access_code: response.data.access_code,
                    reference: response.data.reference
                }
            });
        } else {
            res.status(400).json({
                status: false,
                message: response.message || 'Payment initialization failed'
            });
        }
    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({
            status: false,
            message: 'Payment processing failed',
            error: error.message
        });
    }
});

// @route   GET /api/payment/verify/:reference
// @desc    Verify Paystack payment and create order
// @access  Public
router.get('/verify/:reference', async (req, res) => {
    try {
        const { reference } = req.params;

        if (!reference) {
            return res.status(400).json({ message: 'Payment reference is required' });
        }

        const response = await paystackRequest(`/transaction/verify/${reference}`, 'GET');

        if (response.status && response.data.status === 'success') {
            // Import Order model and email service
            const Order = (await import('../models/Order.js')).default;
            const { sendOrderConfirmationEmail } = await import('../services/emailService.js');

            // Check if order already exists for this reference
            const existingOrder = await Order.findOne({ paymentReference: reference });

            if (!existingOrder) {
                // Extract order data from payment metadata
                const metadata = response.data.metadata || {};
                const customerEmail = response.data.customer.email;

                // Parse product information from metadata
                let orderItems = [];

                if (metadata.productId && metadata.productName) {
                    // Single product purchase
                    orderItems = [{
                        productId: metadata.productId === 'cart_checkout' ? null : metadata.productId,
                        productName: metadata.productName,
                        price: response.data.amount / 100, // Total amount
                        quantity: 1
                    }];
                } else {
                    // Default fallback
                    orderItems = [{
                        productId: null,
                        productName: 'Order',
                        price: response.data.amount / 100,
                        quantity: 1
                    }];
                }

                // Create order
                const order = await Order.create({
                    customerEmail,
                    items: orderItems,
                    totalAmount: response.data.amount / 100,
                    paymentReference: reference,
                    paymentStatus: 'successful',
                    orderStatus: 'pending'
                });

                console.log(`✓ Order created: ${order.orderNumber}`);

                // Send confirmation email (don't block on email failure)
                try {
                    await sendOrderConfirmationEmail({
                        customerEmail: order.customerEmail,
                        orderNumber: order.orderNumber,
                        items: order.items,
                        totalAmount: order.totalAmount,
                        paymentReference: order.paymentReference,
                        createdAt: order.createdAt
                    });
                } catch (emailError) {
                    console.error('Email send failed (non-blocking):', emailError.message);
                }
            }

            res.json({
                status: true,
                message: 'Payment verified successfully',
                data: {
                    reference: response.data.reference,
                    amount: response.data.amount / 100,
                    status: response.data.status,
                    metadata: response.data.metadata,
                    orderCreated: !existingOrder
                }
            });
        } else {
            res.status(400).json({
                status: false,
                message: 'Payment verification failed'
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            status: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
});

// @route   POST /api/payment/webhook
// @desc    Handle Paystack webhooks
// @access  Public (Paystack)
router.post('/webhook', express.json(), async (req, res) => {
    try {
        const hash = req.headers['x-paystack-signature'];
        const secret = process.env.PAYSTACK_SECRET_KEY;

        // Verify webhook signature
        const crypto = await import('crypto');
        const hmac = crypto.createHmac('sha512', secret);
        const expectedHash = hmac.update(JSON.stringify(req.body)).digest('hex');

        if (hash === expectedHash) {
            const event = req.body;

            // Handle different webhook events
            switch (event.event) {
                case 'charge.success':
                    console.log('Payment successful:', event.data);
                    // TODO: Update order status, send confirmation email, etc.
                    break;
                case 'charge.failed':
                    console.log('Payment failed:', event.data);
                    // TODO: Handle failed payment
                    break;
                default:
                    console.log(`Unhandled event type: ${event.event}`);
            }

            res.sendStatus(200);
        } else {
            console.error('Invalid webhook signature');
            res.sendStatus(400);
        }
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
});

export default router;
