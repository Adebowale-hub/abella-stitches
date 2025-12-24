import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product._id}`} className="product-card">
            <div className="product-image-wrapper">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image'}
                    alt={product.productName}
                    className="product-image"
                />
                <div className="product-category-badge">{product.category}</div>
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.productName}</h3>
                <p className="product-price">
                    ₦{product.price ? product.price.toLocaleString('en-NG') : '0'}
                </p>
                <button className="btn btn-primary btn-small product-btn">View Details</button>
            </div>
        </Link>
    );
};

export default ProductCard;
