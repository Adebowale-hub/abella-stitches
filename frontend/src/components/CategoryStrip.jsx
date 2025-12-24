import { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import './CategoryStrip.css';

const CategoryStrip = ({ activeCategory, onCategoryChange }) => {
    const [categories, setCategories] = useState(['All']);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const dbCategories = await productsAPI.getCategories();
            // Always include 'All' as the first option, then add unique DB categories
            setCategories(['All', ...dbCategories]);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to just 'All' if there's an error
            setCategories(['All']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="category-strip">
            <div className="container">
                <div className="category-container">
                    <div className="category-buttons">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => onCategoryChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryStrip;
