import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/utils/axiosInstance';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            const response = await axiosInstance.get('/get-user');
            setUser(response.data.user);
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await axiosInstance.post('/login', { email, password });
        const { accessToken, user: userData } = response.data;

        localStorage.setItem('token', accessToken);
        setUser(userData);

        if (response.data.isReady) {
            window.location.replace('/dashboard');
        } else {
            window.location.replace('/onboarding');
        }
    };

    const logout = async () => {
        try {
            if (user?.email) {
                await axiosInstance.post('/logout', { email: user.email });
            }
        } catch (err) {
            console.error('Logout request failed:', err);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            window.location.replace('/login');
        }
    };

    const register = async (name: string, email: string, password: string) => {
        const response = await axiosInstance.post('/users', { name, email, password });
        const { accessToken, user: userData } = response.data;

        localStorage.setItem('token', accessToken);
        setUser(userData);
        window.location.replace('/onboarding');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};