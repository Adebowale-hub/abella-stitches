import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products, loading, showViewAll = false }) => {
    // Ensure products is always an array
    const productList = Array.isArray(products) ? products : [];

    if (loading) {
        return (
            <section className="product-grid-section" id="catalog">
                <div className="container">
                    <div className="spinner"></div>
                </div>
            </section>
        );
    }

    if (productList.length === 0) {
        return (
            <section className="product-grid-section" id="catalog">
                <div className="container">
                    <div className="empty-state">
                        <h3>No products found</h3>
                        <p>Try selecting a different category</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="product-grid-section" id="catalog">
            <div className="container">
                <div className="catalog-panel">
                    <h2 className="section-title">New Arrivals</h2>
                    <div className="product-grid">
                        {productList.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    {showViewAll && (
                        <div className="view-all-container">
                            <Link to="/shop" className="view-all-btn">
                                Shop All Products
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
