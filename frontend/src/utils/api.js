// Use environment variable in production, fallback to proxy in development
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
    getAll: async (category = null) => {
        const query = category && category !== 'All' ? `?category=${category}` : '';
        return fetchAPI(`/products${query}`);
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

// Payment API (Stripe)
export const paymentAPI = {
    createCheckoutSession: async (productData) => {
        return fetchAPI('/payment/create-checkout-session', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }
};
