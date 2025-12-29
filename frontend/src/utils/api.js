// Use environment variable in production, fallback to relative path for Vercel
// For Vercel deployment (both frontend and backend on same domain), use '/api'
// For separate deployments, set VITE_API_URL to your backend URL
const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';


// Generic fetch wrapper
const fetchAPI = async (url, options = {}) => {
    const config = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    const response = await fetch(`${API_BASE}${url}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// Admin API
export const adminAPI = {
    login: async (email, password) => {
        return fetchAPI('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    logout: async () => {
        return fetchAPI('/admin/logout', {
            method: 'POST'
        });
    },

    getMe: async () => {
        return fetchAPI('/admin/me');
    }
};

// Products API
export const productsAPI = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add each parameter if it exists
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });

        const queryString = queryParams.toString();
        return fetchAPI(`/products${queryString ? `?${queryString}` : ''}`);
    },

    getById: async (id) => {
        return fetchAPI(`/products/${id}`);
    },

    getCategories: async () => {
        return fetchAPI('/products/categories/unique');
    },

    create: async (productData) => {
        return fetchAPI('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    },

    update: async (id, productData) => {
        return fetchAPI(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    },

    delete: async (id) => {
        return fetchAPI(`/products/${id}`, {
            method: 'DELETE'
        });
    }
};

// Newsletter API
export const newsletterAPI = {
    subscribe: async (email) => {
        return fetchAPI('/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }
};

// Payment API (Paystack)
export const paymentAPI = {
    initializePayment: async (paymentData) => {
        return fetchAPI('/payment/initialize', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    },

    verifyPayment: async (reference) => {
        return fetchAPI(`/payment/verify/${reference}`);
    }
};

// Orders API
export const ordersAPI = {
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return fetchAPI(`/orders${queryParams ? `?${queryParams}` : ''}`);
    },

    getStats: async () => {
        return fetchAPI('/orders/stats');
    },

    getById: async (id) => {
        return fetchAPI(`/orders/${id}`);
    },

    updateStatus: async (id, statusData) => {
        return fetchAPI(`/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(statusData)
        });
    }
};

