import './App.css';
import MainLayout from './layout/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import SignUp from './pages/SignUpPage';
import Dashboard from './pages/Dashboard/DashboardPage';
import { PATHS } from './constants/paths';
import Onboarding from './pages/OnboardingPage';
import axiosInstance from './utils/axiosInstance';
import { useState, useEffect } from 'react';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    isReady: boolean;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axiosInstance.get('/get-user')
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path={PATHS.LOGIN} element={<Login />} />
          <Route path={PATHS.SIGNUP} element={<SignUp />} />
          <Route path={PATHS.ONBOARDING} element={
            <ProtectedRoute user={user}>
              <Onboarding />
            </ProtectedRoute>
          } />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
