import { useState } from 'react';
import emailjs from '@emailjs/browser';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        // Validate environment variables
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

        if (!publicKey || !serviceId || !templateId) {
            setStatus({
                type: 'error',
                message: 'Email service is not configured. Please contact the administrator.'
            });
            setLoading(false);
            return;
        }

        try {
            // Send email using EmailJS
            await emailjs.send(
                serviceId,
                templateId,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    to_name: 'Abella Stitches Team',
                },
                publicKey
            );

            setStatus({
                type: 'success',
                message: '✓ Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
            });
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Clear success message after 8 seconds
            setTimeout(() => setStatus({ type: '', message: '' }), 8000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus({
                type: 'error',
                message: '✗ Failed to send message. Please try again or contact us directly at hello@adirehub.com'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <main className="contact-page">
                <div className="container">
                    <div className="contact-content">
                        <div className="contact-text">
                            <h1>Get In Touch</h1>
                            <p>
                                Have questions about our products or need styling advice?
                                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                            </p>

                            <div className="contact-info">
                                <div className="contact-info-item">
                                    <h3>📧 Email</h3>
                                    <p>hello@adirehub.com</p>
                                </div>
                                <div className="contact-info-item">
                                    <h3>📞 Phone</h3>
                                    <p>+234 800 123 4567</p>
                                </div>
                                <div className="contact-info-item">
                                    <h3>📍 Location</h3>
                                    <p>Lagos, Nigeria</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-wrapper">
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name" className="label">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="label">Your Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject" className="label">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="e.g., Product Inquiry, Custom Order, etc."
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="label">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="textarea"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-large"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>

                                {status.message && (
                                    <p className={`${status.type === 'success' ? 'success-message' : 'error-message'}`}>
                                        {status.message}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
