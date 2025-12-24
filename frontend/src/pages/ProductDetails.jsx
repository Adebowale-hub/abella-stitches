import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productsAPI, paymentAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showAddedMessage, setShowAddedMessage] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await productsAPI.getById(id);
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Product not found');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        addToCart(product);
        setShowAddedMessage(true);

        // Hide message after 2 seconds
        setTimeout(() => setShowAddedMessage(false), 2000);
    };

    const handleBuyNow = async () => {
        if (!product) return;

        try {
            setCheckoutLoading(true);
            const response = await paymentAPI.createCheckoutSession({
                productId: product._id,
                productName: product.productName,
                price: product.price,
                imageUrl: product.imageUrl
            });

            // If Stripe is configured, redirect to checkout
            if (response.url) {
                window.location.href = response.url;
            } else {
                // Mock response - show alert
                alert('Payment gateway not yet configured. Please add Stripe API keys to enable checkout.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to initiate checkout. Please try again.');
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <div className="spinner"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div>
                <Header />
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <h2>Product Not Found</h2>
                    <button onClick={() => navigate('/')} className="btn btn-primary">
                        Back to Home
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className="product-details-page">
                <div className="container">
                    <div className="product-details-content">
                        {/* Product Image */}
                        <div className="product-details-image">
                            <img
                                src={product.imageUrl || 'https://via.placeholder.com/600x750?text=No+Image'}
                                alt={product.productName}
                            />
                            <div className="product-category-large">{product.category}</div>
                        </div>

                        {/* Product Info */}
                        <div className="product-details-info">
                            <h1 className="product-title">{product.productName}</h1>


                            <div className="product-price-large">
                                ₦{product.price ? product.price.toLocaleString('en-NG') : '0'}
                            </div>

                            {product.description && (
                                <div className="product-description">
                                    <h3>Description</h3>
                                    <p>{product.description}</p>
                                </div>
                            )}

                            <div className="product-actions">
                                <button
                                    onClick={handleAddToCart}
                                    className="btn btn-secondary btn-large"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="btn btn-primary btn-large"
                                    disabled={checkoutLoading}
                                >
                                    {checkoutLoading ? 'Processing...' : 'Buy Now'}
                                </button>
                            </div>

                            {showAddedMessage && (
                                <div className="added-to-cart-message">
                                    ✓ Added to cart!
                                </div>
                            )}

                            <button
                                onClick={() => navigate('/')}
                                className="btn btn-outline btn-large continue-shopping-btn"
                            >
                                Continue Shopping
                            </button>

                            <div className="product-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Authentic African Craftsmanship</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Premium Quality Materials</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Secure Payment Processing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetails;
