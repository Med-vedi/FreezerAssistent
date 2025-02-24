import { Navigate, useLocation } from 'react-router-dom';
import { PATHS } from '../constants/paths';

interface ProtectedRouteProps {
    children: React.ReactNode;
    user: {
        id: string;
        name: string;
        email: string;
        isReady: boolean;
    } | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    // If no token, redirect to login
    if (!token) {
        return <Navigate to={PATHS.LOGIN} replace />;
    }

    // If user is already "ready" and trying to access onboarding, redirect to dashboard
    if (user?.isReady && location.pathname === PATHS.ONBOARDING) {
        return <Navigate to={PATHS.DASHBOARD} replace />;
    }

    // Otherwise, allow access to the protected page
    return <>{children}</>;
};

export default ProtectedRoute;
