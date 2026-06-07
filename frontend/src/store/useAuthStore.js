import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/login', { email, password });
            const { data, token } = response.data;
            localStorage.setItem('token', token);
            set({ user: data, token, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
            return false;
        }
    },
    
    register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/register', { username, email, password });
            const { data, token } = response.data;
            localStorage.setItem('token', token);
            set({ user: data, token, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    fetchProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await api.get('/users/me');
            set({ user: response.data.data, isAuthenticated: true });
        } catch (error) {
            set({ user: null, token: null, isAuthenticated: false });
        }
    }
}));

export default useAuthStore;