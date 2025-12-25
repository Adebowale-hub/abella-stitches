import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentAPI } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    const [verifying, setVerifying] = useState(true);
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!reference) {
                setError('No payment reference found');
                setVerifying(false);
                return;
            }

            try {
                const response = await paymentAPI.verifyPayment(reference);
                if (response.status) {
                    setPaymentData(response.data);
                } else {
                    setError('Payment verification failed');
                }
            } catch (err) {
                console.error('Verification error:', err);
                setError(err.message || 'Failed to verify payment');
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [reference]);

    return (
        <div>
            <Header />
            <main className="payment-result-page">
                <div className="container">
                    {verifying ? (
                        <div className="payment-result-content">
                            <div className="loading-spinner">Verifying payment...</div>
                        </div>
                    ) : error ? (
                        <div className="payment-result-content cancel">
                            <div className="result-icon">✕</div>
                            <h1>Verification Failed</h1>
                            <p className="result-message">{error}</p>
                            <div className="result-actions">
                                <button
                                    onClick={() => navigate('/')}
                                    className="btn btn-primary btn-large"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="payment-result-content success">
                            <div className="result-icon">✓</div>
                            <h1>Payment Successful!</h1>
                            <p className="result-message">
                                Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                            </p>
                            {paymentData && (
                                <div className="payment-details">
                                    <p><strong>Reference:</strong> {paymentData.reference}</p>
                                    <p><strong>Amount:</strong> ₦{paymentData.amount?.toLocaleString()}</p>
                                </div>
                            )}
                            <p className="result-submessage">
                                You will receive an email confirmation with your order details.
                            </p>

                            <div className="result-actions">
                                <button
                                    onClick={() => navigate('/')}
                                    className="btn btn-primary btn-large"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
