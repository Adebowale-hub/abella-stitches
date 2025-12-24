import { useState } from 'react';
import { newsletterAPI } from '../utils/api';
import './Newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await newsletterAPI.subscribe(email);
            setMessage('Successfully subscribed! Check your inbox.');
            setEmail('');
        } catch (error) {
            setMessage(error.message || 'Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="newsletter-section">
            <div className="container">
                <div className="newsletter-content">
                    <div className="newsletter-text">
                        <h2>Join Our Style List</h2>
                        <p>Sign up for exclusive drops, discounts, and styling tips delivered to your inbox.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input newsletter-input"
                            required
                        />
                        <button
                            type="submit"
                            className="btn btn-primary newsletter-btn"
                            disabled={loading}
                        >
                            {loading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>

                    {message && (
                        <p className={`newsletter-message ${message.includes('Success') ? 'success' : 'error'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
