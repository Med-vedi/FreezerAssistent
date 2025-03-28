import { createContext, useContext, ReactNode, useState } from 'react';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from '@/store/users/users.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);

    const [login] = useLoginMutation();
    const [register] = useRegisterMutation();
    const [logout] = useLogoutMutation();

    const user = useSelector((state: RootState) => state.userState.user);

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const result = await login({ email, password }).unwrap();
            return result.user;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        if (user?.email) {
            setIsLoading(true);
            try {
                await logout({ email: user.email });
                window.location.replace('/login');
            } catch (error) {
                console.error('Logout failed:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleRegister = async (name: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            await register({ name, email, password }).unwrap();
            // The user data will be automatically updated in the Redux store
            window.location.replace('/onboarding');
        } catch (error) {
            console.error('Register failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser: () => { },
            isLoading,
            login: handleLogin,
            logout: handleLogout,
            register: handleRegister,
            checkAuth: () => Promise.resolve(user), // No longer needed with RTK Query
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