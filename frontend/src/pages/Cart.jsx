import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutModal from '../components/CheckoutModal';
import { paymentAPI } from '../utils/api';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckoutClick = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        setIsCheckoutModalOpen(true);
    };

    const handlePaymentSubmission = async (formData) => {
        try {
            setIsProcessing(true);
            const { email, ...shippingAddress } = formData;

            // Create Paystack payment with all cart items
            const totalAmount = getCartTotal();
            const productNames = cartItems.map(item => `${item.productName} (x${item.quantity})`).join(', ');

            const response = await paymentAPI.initializePayment({
                email,
                amount: totalAmount,
                productId: 'cart_checkout',
                productName: `Cart: ${productNames}`,
                shippingAddress
            });

            // Redirect to Paystack checkout page
            if (response.status && response.data.authorization_url) {
                // Clear cart after successful checkout session creation
                clearCart();
                window.location.href = response.data.authorization_url;
            } else {
                alert('Failed to initialize payment. Please try again.');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(error.message || 'Failed to initiate checkout. Please try again.');
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div>
                <Header />
                <main className="cart-page">
                    <div className="container">
                        <div className="empty-cart">
                            <h1>Your Cart is Empty</h1>
                            <p>Add some items to get started!</p>
                            <button onClick={() => navigate('/')} className="btn btn-primary btn-large">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className="cart-page">
                <div className="container">
                    <h1 className="cart-title">Shopping Cart</h1>

                    <div className="cart-content">
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item._id} className="cart-item">
                                    <Link to={`/product/${item._id}`} className="cart-item-image">
                                        <img
                                            src={item.imageUrl || 'https://via.placeholder.com/150'}
                                            alt={item.productName}
                                        />
                                    </Link>

                                    <div className="cart-item-details">
                                        <Link to={`/product/${item._id}`} className="cart-item-name">
                                            {item.productName}
                                        </Link>
                                        <p className="cart-item-category">{item.category}</p>
                                        <p className="cart-item-price">
                                            ₦{item.price.toLocaleString('en-NG')}
                                        </p>
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="quantity-btn"
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="quantity-btn"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="remove-btn"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="cart-item-total">
                                        ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                <span>₦{getCartTotal().toLocaleString('en-NG')}</span>
                            </div>

                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₦{getCartTotal().toLocaleString('en-NG')}</span>
                            </div>

                            <button onClick={handleCheckoutClick} className="btn btn-primary btn-large checkout-btn">
                                Proceed to Checkout
                            </button>

                            <button onClick={() => navigate('/')} className="btn btn-outline btn-large">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                onSubmit={handlePaymentSubmission}
                totalAmount={getCartTotal()}
                loading={isProcessing}
            />

            <Footer />
        </div>
    );
};

export default Cart;
