import './App.css'
import MainLayout from './layout/MainLayout'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage'
import SignUp from './pages/SignUpPage'
import Dashboard from './pages/Dashboard/DashboardPage'
import { PATHS } from './constants/paths'
import Onboarding from './pages/OnboardingPage'
import axiosInstance from './utils/axiosInstance'
import { useState, useEffect } from 'react'
const ProtectedRoute = ({ children, user }: {
  children: React.ReactNode, user: {
    id: string;
    name: string;
    email: string;
    isReady: boolean;
  } | null
}) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (user?.isReady) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

function App() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    isReady: boolean;
  } | null>(null);


  useEffect(() => {
    axiosInstance.get('/get-user').then((res) => {
      setUser(res.data.user);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path={PATHS.LOGIN} element={<Login />} />
          <Route path={PATHS.SIGNUP} element={<SignUp />} />
          <Route path={PATHS.ONBOARDING} element={
            <ProtectedRoute user={user}>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path={PATHS.DASHBOARD} element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
