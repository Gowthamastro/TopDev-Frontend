import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Prefer same-origin (nginx proxy) when served from the Docker frontend,
// fall back to explicit VITE_API_BASE_URL mainly for Vite dev.
const resolvedBaseURL =
    (typeof window !== 'undefined' && window.location.origin.includes('localhost:517'))
        ? ''
        : (import.meta.env.VITE_API_BASE_URL || '');

const api = axios.create({
    baseURL: resolvedBaseURL,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            const refreshToken = useAuthStore.getState().refreshToken;
            
            if (refreshToken) {
                try {
                    const res = await axios.post(`${api.defaults.baseURL}/api/v1/auth/refresh`, { refresh_token: refreshToken });
                    useAuthStore.getState().setTokens(res.data.access_token, res.data.refresh_token);
                    original.headers.Authorization = `Bearer ${res.data.access_token}`;
                    return api(original);
                } catch (refreshError) {
                    console.error('Refresh token expired or invalid', refreshError);
                    useAuthStore.getState().logout();
                    window.location.href = '/login';
                }
            } else {
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
        }
        
        // Handle 403 Forbidden (gracefully)
        if (error.response?.status === 403) {
            console.warn('Access forbidden: You may not have permission for this resource.');
        }

        return Promise.reject(error);
    }
);

export default api;
