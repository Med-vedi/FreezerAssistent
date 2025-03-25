import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    isReady: boolean;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    checkAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',  // Development
    // baseURL: 'https://your-production-backend.com',  // Production
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

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
                return null;
            }

            const response = await axiosInstance.get('/get-user');
            const userData = response.data.user;
            setUser(userData);
            return userData;
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
            setUser(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<User> => {
        try {
            const response = await axiosInstance.post('/login', {
                email,
                password
            });
            const { accessToken, user: userData } = response.data;
            localStorage.setItem('token', accessToken);
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
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

    useEffect(() => {
        // console.log('user', user)
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isLoading,
            login,
            logout,
            register,
            checkAuth
        }}>
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