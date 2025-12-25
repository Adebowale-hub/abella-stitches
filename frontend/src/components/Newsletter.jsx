import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { newsletterAPI } from '../utils/api';
import './Newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const sendConfirmationEmail = async (subscriberEmail) => {
        try {
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID;

            // If EmailJS is not configured, skip sending confirmation email
            if (!publicKey || !serviceId || !templateId) {
                console.warn('EmailJS is not configured for newsletter confirmations');
                return;
            }

            await emailjs.send(
                serviceId,
                templateId,
                {
                    user_email: subscriberEmail,
                    to_email: subscriberEmail,
                },
                publicKey
            );
        } catch (error) {
            // Don't fail the subscription if email sending fails
            console.error('Failed to send confirmation email:', error);
        }
    };

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
            // Subscribe via backend
            await newsletterAPI.subscribe(email);

            // Send confirmation email (non-blocking)
            await sendConfirmationEmail(email);

            setMessage('Successfully subscribed! Check your inbox for confirmation.');
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
