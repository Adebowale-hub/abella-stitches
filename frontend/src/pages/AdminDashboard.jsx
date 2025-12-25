import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI } from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const [newProduct, setNewProduct] = useState({
        productName: '',
        category: '',
        price: '',
        imageUrl: '',
        description: ''
    });

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productsAPI.getAll();
            setProducts(data);
        } catch (error) {
            showToast('Error fetching products', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleInputChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();

        if (!newProduct.productName || !newProduct.category) {
            showToast('Product name and category are required', 'error');
            return;
        }

        try {
            await productsAPI.create(newProduct);

            showToast('Product created successfully!');
            setNewProduct({
                productName: '',
                category: '',
                price: '',
                imageUrl: '',
                description: ''
            });
            fetchProducts();
        } catch (error) {
            showToast(error.message || 'Failed to create product', 'error');
        }
    };

    const handleEditClick = (product) => {
        setEditingId(product._id);
        setEditForm({ ...product });
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProduct = async (id) => {
        try {
            await productsAPI.update(id, editForm);

            showToast('Product updated successfully!');
            setEditingId(null);
            fetchProducts();
        } catch (error) {
            showToast(error.message || 'Failed to update product', 'error');
        }
    };

    const handleDeleteProduct = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await productsAPI.delete(id);
            showToast('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            showToast(error.message || 'Failed to delete product', 'error');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="admin-dashboard">
            {/* Toast Notification */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}

            {/* Top Navigation */}
            <header className="admin-header">
                <div className="container">
                    <div className="admin-header-content">
                        <div className="admin-logo">
                            <img
                                src="/logo.png"
                                alt="Abella Stitches"
                                style={{ height: '35px', width: 'auto' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => navigate('/admin/orders')} className="btn btn-secondary btn-small">
                                View Orders
                            </button>
                            <button onClick={handleLogout} className="btn btn-outline btn-small">
                                Exit Admin
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="admin-main">
                <div className="container">
                    <h1 className="admin-title">Store Management</h1>

                    <div className="admin-content">
                        {/* Left: Add Product Panel */}
                        <div className="admin-panel">
                            <h2 className="panel-title">Add Product</h2>
                            <form onSubmit={handleCreateProduct} className="product-form">
                                <div className="form-group">
                                    <label htmlFor="productName" className="label">Product Name *</label>
                                    <input
                                        type="text"
                                        id="productName"
                                        name="productName"
                                        value={newProduct.productName}
                                        onChange={handleInputChange}
                                        className="input"
                                        placeholder="E.g., Ankara Print Dress"
                                        required
                                    />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="category" className="label">Category *</label>
                                    <input
                                        type="text"
                                        id="category"
                                        name="category"
                                        value={newProduct.category}
                                        onChange={handleInputChange}
                                        className="input"
                                        placeholder="E.g., Batik, Tie-Dye, Ankara, Adire, Streetwear"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price" className="label">Price (NGN) *</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={newProduct.price}
                                        onChange={handleInputChange}
                                        className="input"
                                        placeholder="E.g., 45000"
                                        step="100"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="imageUrl" className="label">Image URL</label>
                                    <input
                                        type="url"
                                        id="imageUrl"
                                        name="imageUrl"
                                        value={newProduct.imageUrl}
                                        onChange={handleInputChange}
                                        className="input"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description" className="label">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={newProduct.description}
                                        onChange={handleInputChange}
                                        className="textarea"
                                        placeholder="Product description..."
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-large create-btn">
                                    Create
                                </button>
                            </form>
                        </div>

                        {/* Right: Inventory Panel */}
                        <div className="admin-panel">
                            <h2 className="panel-title">Inventory ({products.length})</h2>

                            {loading ? (
                                <div className="spinner"></div>
                            ) : products.length === 0 ? (
                                <div className="empty-inventory">
                                    <p>No products yet. Add your first product!</p>
                                </div>
                            ) : (
                                <div className="inventory-list">
                                    {products.map((product) => (
                                        <div key={product._id} className="inventory-item">
                                            {editingId === product._id ? (
                                                // Edit Mode
                                                <div className="edit-form">
                                                    <input
                                                        type="text"
                                                        name="productName"
                                                        value={editForm.productName}
                                                        onChange={handleEditChange}
                                                        className="input input-small"
                                                        placeholder="Product Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="category"
                                                        value={editForm.category}
                                                        onChange={handleEditChange}
                                                        className="input input-small"
                                                        placeholder="Category"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        value={editForm.price || ''}
                                                        onChange={handleEditChange}
                                                        className="input input-small"
                                                        placeholder="Price (NGN)"
                                                        step="100"
                                                        min="0"
                                                    />
                                                    <input
                                                        type="url"
                                                        name="imageUrl"
                                                        value={editForm.imageUrl}
                                                        onChange={handleEditChange}
                                                        className="input input-small"
                                                        placeholder="Image URL"
                                                    />
                                                    <textarea
                                                        name="description"
                                                        value={editForm.description}
                                                        onChange={handleEditChange}
                                                        className="textarea"
                                                        placeholder="Description"
                                                        rows="2"
                                                    />
                                                    <div className="edit-actions">
                                                        <button
                                                            onClick={() => handleUpdateProduct(product._id)}
                                                            className="btn btn-primary btn-small"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="btn btn-outline btn-small"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // View Mode
                                                <>
                                                    {product.imageUrl && (
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={product.productName}
                                                            className="inventory-thumbnail"
                                                        />
                                                    )}
                                                    <div className="inventory-details">
                                                        <h3 className="inventory-name">{product.productName}</h3>
                                                        <p className="inventory-category">{product.category}</p>
                                                    </div>
                                                    <div className="inventory-actions">
                                                        <button
                                                            onClick={() => handleEditClick(product)}
                                                            className="btn btn-secondary btn-small"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product._id, product.productName)}
                                                            className="btn btn-outline btn-small delete-btn"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
