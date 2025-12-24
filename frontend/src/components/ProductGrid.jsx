import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products, loading }) => {
    if (loading) {
        return (
            <section className="product-grid-section" id="catalog">
                <div className="container">
                    <div className="spinner"></div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
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
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
