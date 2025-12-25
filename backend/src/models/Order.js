import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    // Customer Information
    customerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    // Order Items
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        category: String,
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        imageUrl: String
    }],

    // Order Totals
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    // Payment Information
    paymentReference: {
        type: String,
        required: true,
        unique: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    },
    paymentGateway: {
        type: String,
        default: 'paystack'
    },

    // Order Status
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    // Additional Information
    orderNotes: String,
    trackingNumber: String

}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
orderSchema.index({ customerEmail: 1, createdAt: -1 });
orderSchema.index({ paymentReference: 1 });
orderSchema.index({ orderStatus: 1 });

// Virtual for order number (readable format)
orderSchema.virtual('orderNumber').get(function () {
    return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
