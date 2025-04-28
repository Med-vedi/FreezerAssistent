import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL_DEV,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to automatically add token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('Response error:', error.response.status, error.response.data);
            if (error.response.status === 401) {
                // Handle unauthorized access
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Request error:', error.request);
        } else {
            // Error in request configuration
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;