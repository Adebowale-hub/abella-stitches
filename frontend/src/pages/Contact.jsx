import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });

        setTimeout(() => setSubmitted(false), 5000);
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
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-large">
                                    Send Message
                                </button>

                                {submitted && (
                                    <p className="success-message">
                                        ✓ Thank you! Your message has been sent successfully.
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
