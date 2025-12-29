import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import './FilterSidebar.css';

const FilterSidebar = ({
    categories,
    filters,
    onFilterChange,
    onClearFilters,
    isMobile,
    isOpen,
    onClose
}) => {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleSearchChange = (e) => {
        const newFilters = { ...localFilters, search: e.target.value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleCategoryChange = (category) => {
        const newFilters = { ...localFilters, category };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceChange = (field, value) => {
        const newFilters = { ...localFilters, [field]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSortChange = (e) => {
        const newFilters = { ...localFilters, sort: e.target.value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClear = () => {
        const clearedFilters = {
            search: '',
            category: 'All',
            minPrice: '',
            maxPrice: '',
            sort: 'newest'
        };
        setLocalFilters(clearedFilters);
        onClearFilters();
    };

    const activeFilterCount = () => {
        let count = 0;
        if (localFilters.search) count++;
        if (localFilters.category && localFilters.category !== 'All') count++;
        if (localFilters.minPrice) count++;
        if (localFilters.maxPrice) count++;
        return count;
    };

    const sidebarContent = (
        <>
            {/* Search */}
            <div className="filter-group">
                <label className="filter-label">
                    <Search size={18} />
                    Search Products
                </label>
                <input
                    type="text"
                    className="filter-search-input"
                    placeholder="Search by name..."
                    value={localFilters.search}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Sort */}
            <div className="filter-group">
                <label className="filter-label">
                    <SlidersHorizontal size={18} />
                    Sort By
                </label>
                <select
                    className="filter-select"
                    value={localFilters.sort}
                    onChange={handleSortChange}
                >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                </select>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
                <label className="filter-label">Category</label>
                <div className="filter-options">
                    {['All', ...categories].map((cat) => (
                        <button
                            key={cat}
                            className={`filter-chip ${localFilters.category === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
                <label className="filter-label">Price Range (₦)</label>
                <div className="price-inputs">
                    <input
                        type="number"
                        className="price-input"
                        placeholder="Min"
                        value={localFilters.minPrice}
                        onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                    />
                    <span className="price-separator">-</span>
                    <input
                        type="number"
                        className="price-input"
                        placeholder="Max"
                        value={localFilters.maxPrice}
                        onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    />
                </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount() > 0 && (
                <button className="clear-filters-btn" onClick={handleClear}>
                    <X size={18} />
                    Clear All Filters ({activeFilterCount()})
                </button>
            )}
        </>
    );

    if (isMobile) {
        return (
            <div className={`filter-sidebar-mobile ${isOpen ? 'open' : ''}`}>
                <div className="filter-sidebar-overlay" onClick={onClose}></div>
                <div className="filter-sidebar-panel">
                    <div className="filter-sidebar-header">
                        <h3>Filters</h3>
                        <button className="close-btn" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                    <div className="filter-sidebar-content">
                        {sidebarContent}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <aside className="filter-sidebar">
            <h3 className="filter-sidebar-title">Filters</h3>
            {sidebarContent}
        </aside>
    );
};

export default FilterSidebar;
