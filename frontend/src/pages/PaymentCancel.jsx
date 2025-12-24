import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PaymentSuccess.css';

const PaymentCancel = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Header />
            <main className="payment-result-page">
                <div className="container">
                    <div className="payment-result-content cancel">
                        <div className="result-icon">✕</div>
                        <h1>Payment Cancelled</h1>
                        <p className="result-message">
                            Your payment was cancelled. No charges were made to your account.
                        </p>
                        <p className="result-submessage">
                            Feel free to continue browsing our collection or try checkout again.
                        </p>

                        <div className="result-actions">
                            <button
                                onClick={() => navigate('/')}
                                className="btn btn-primary btn-large"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentCancel;
