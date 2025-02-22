import { BASE_URL } from './constants';
import axios, { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('Response error:', error.response.status, error.response.data);
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