import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../utils/api';
import './Orders.css';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, [filterStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const filters = filterStatus ? { status: filterStatus } : {};
            const data = await ordersAPI.getAll(filters);
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await ordersAPI.getStats();
            setStats(data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await ordersAPI.updateStatus(orderId, { orderStatus: newStatus });
            alert('Order status updated successfully');
            fetchOrders();
            setShowModal(false);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update order status');
        }
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            pending: 'status-badge status-pending',
            processing: 'status-badge status-processing',
            shipped: 'status-badge status-shipped',
            delivered: 'status-badge status-delivered',
            cancelled: 'status-badge status-cancelled'
        };
        return statusClasses[status] || 'status-badge';
    };

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h1>Orders Management</h1>
                <button onClick={() => navigate('/admin')} className="btn btn-outline">
                    Back to Dashboard
                </button>
            </div>

            {stats && (
                <div className="orders-stats">
                    <div className="stat-card">
                        <h3>{stats.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                    <div className="stat-card">
                        <h3>{stats.pendingOrders}</h3>
                        <p>Pending</p>
                    </div>
                    <div className="stat-card">
                        <h3>{stats.processingOrders}</h3>
                        <p>Processing</p>
                    </div>
                    <div className="stat-card">
                        <h3>{stats.shippedOrders}</h3>
                        <p>Shipped</p>
                    </div>
                    <div className="stat-card highlight">
                        <h3>₦{stats.totalRevenue.toLocaleString()}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
            )}

            <div className="orders-filters">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="no-orders">
                    <p>No orders found</p>
                </div>
            ) : (
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td className="order-number">{order.orderNumber}</td>
                                    <td>{order.customerEmail}</td>
                                    <td>{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                                    <td>₦{order.totalAmount.toLocaleString()}</td>
                                    <td>
                                        <span className={getStatusBadgeClass(order.orderStatus)}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => viewOrderDetails(order)}
                                            className="btn-small btn-primary"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Order Details: {selectedOrder.orderNumber}</h2>
                            <button onClick={() => setShowModal(false)} className="modal-close">×</button>
                        </div>

                        <div className="modal-body">
                            <div className="order-info">
                                <div className="info-row">
                                    <strong>Customer Email:</strong> {selectedOrder.customerEmail}
                                </div>
                                <div className="info-row">
                                    <strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                                </div>
                                <div className="info-row">
                                    <strong>Payment Reference:</strong> {selectedOrder.paymentReference}
                                </div>
                                <div className="info-row">
                                    <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
                                </div>
                            </div>

                            <h3>Order Items</h3>
                            <div className="order-items">
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div>{item.productName}</div>
                                        <div>Qty: {item.quantity}</div>
                                        <div>₦{(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-total">
                                <strong>Total: ₦{selectedOrder.totalAmount.toLocaleString()}</strong>
                            </div>

                            <h3>Update Order Status</h3>
                            <div className="status-update">
                                <select
                                    defaultValue={selectedOrder.orderStatus}
                                    onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                                    className="status-select"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
