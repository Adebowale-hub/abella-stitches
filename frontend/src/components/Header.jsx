import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Header.css';

const Header = () => {
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="header-logo">
                        <img
                            src="/logo.png"
                            alt="Abella Stitches"
                            style={{ height: '40px', width: 'auto' }}
                        />
                    </Link>

                    <nav className="header-nav">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/#catalog" className="nav-link">Shop</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                        <Link to="/cart" className="nav-link cart-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                            </svg>
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
