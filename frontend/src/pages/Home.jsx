import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryStrip from '../components/CategoryStrip';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { productsAPI } from '../utils/api';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [activeCategory, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productsAPI.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        if (activeCategory === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === activeCategory));
        }
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    return (
        <div>
            <Header />
            <Hero />
            <CategoryStrip
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />
            <ProductGrid products={filteredProducts} loading={loading} />
            <Newsletter />
            <Footer />
        </div>
    );
};

export default Home;
