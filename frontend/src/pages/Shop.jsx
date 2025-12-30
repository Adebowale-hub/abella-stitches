import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../utils/api';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: 'All',
        minPrice: '',
        maxPrice: '',
        sort: 'newest'
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1,
        limit: 12
    });
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters, pagination.page]);

    const fetchCategories = async () => {
        try {
            const data = await productsAPI.getCategories();
            // Ensure data is always an array
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]); // Fallback to empty array on error
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {
                ...filters,
                page: pagination.page,
                limit: pagination.limit
            };

            // Remove empty filter values
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === 'All') {
                    delete params[key];
                }
            });

            const data = await productsAPI.getAll(params);

            // Handle both old and new API response formats
            if (data.products) {
                setProducts(Array.isArray(data.products) ? data.products : []);
                setPagination(prev => ({
                    ...prev,
                    ...data.pagination
                }));
            } else if (Array.isArray(data)) {
                // Old format - just array of products
                setProducts(data);
                setPagination(prev => ({
                    ...prev,
                    total: data.length,
                    pages: 1
                }));
            } else {
                // Unexpected format - fallback to empty array
                console.warn('Unexpected API response format:', data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]); // Fallback to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            search: '',
            category: 'All',
            minPrice: '',
            maxPrice: '',
            sort: 'newest'
        };
        setFilters(clearedFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="shop-page">
            <Header />

            <div className="shop-container">
                <div className="container">
                    <div className="shop-header">
                        <div>
                            <h1 className="shop-title">Shop All Products</h1>
                            <p className="shop-subtitle">
                                Showing {products.length} of {pagination.total} products
                            </p>
                        </div>

                        {isMobile && (
                            <button
                                className="mobile-filter-btn"
                                onClick={() => setIsMobileFilterOpen(true)}
                            >
                                <SlidersHorizontal size={20} />
                                Filters
                            </button>
                        )}
                    </div>

                    <div className="shop-content">
                        {/* Desktop Sidebar */}
                        {!isMobile && (
                            <FilterSidebar
                                categories={categories}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                                isMobile={false}
                            />
                        )}

                        {/* Mobile Sidebar */}
                        {isMobile && (
                            <FilterSidebar
                                categories={categories}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                                isMobile={true}
                                isOpen={isMobileFilterOpen}
                                onClose={() => setIsMobileFilterOpen(false)}
                            />
                        )}

                        {/* Products Grid */}
                        <div className="shop-products">
                            {loading ? (
                                <div className="shop-loading">
                                    <div className="spinner"></div>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="shop-empty">
                                    <h3>No products found</h3>
                                    <p>Try adjusting your filters</p>
                                    <button className="reset-btn" onClick={handleClearFilters}>
                                        Clear All Filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="shop-grid">
                                        {products.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination.pages > 1 && (
                                        <div className="pagination">
                                            <button
                                                className="pagination-btn"
                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                disabled={pagination.page === 1}
                                            >
                                                Previous
                                            </button>

                                            <div className="pagination-numbers">
                                                {[...Array(pagination.pages)].map((_, index) => (
                                                    <button
                                                        key={index + 1}
                                                        className={`pagination-number ${pagination.page === index + 1 ? 'active' : ''
                                                            }`}
                                                        onClick={() => handlePageChange(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                className="pagination-btn"
                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                disabled={pagination.page === pagination.pages}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Shop;
