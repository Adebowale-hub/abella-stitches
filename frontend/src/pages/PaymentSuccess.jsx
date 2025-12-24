import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        // Here you could verify the session with your backend
        console.log('Payment session:', sessionId);
    }, [sessionId]);

    return (
        <div>
            <Header />
            <main className="payment-result-page">
                <div className="container">
                    <div className="payment-result-content success">
                        <div className="result-icon">✓</div>
                        <h1>Payment Successful!</h1>
                        <p className="result-message">
                            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                        </p>
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
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
