import React, { useState } from 'react';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, onSubmit, totalAmount, loading }) => {
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="checkout-modal-overlay">
            <div className="checkout-modal-content">
                <div className="checkout-modal-header">
                    <h2>Checkout</h2>
                    <button onClick={onClose} className="checkout-modal-close">&times;</button>
                </div>

                <div className="checkout-summary">
                    <p>Total Amount: <strong>₦{totalAmount.toLocaleString('en-NG')}</strong></p>
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName">Full Name *</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Delivery Address *</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City *</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="state">State *</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="zipCode">Zip Code</label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn btn-primary btn-large btn-block" disabled={loading}>
                            {loading ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;
