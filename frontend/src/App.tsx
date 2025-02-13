import './App.css'
import MainLayout from './layout/MainLayout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/LoginPage'
import SignUp from './pages/SignUpPage'
import Dashboard from './pages/Dashboard/DashboardPage'
import { PATHS } from './constants/paths'
import Onboarding from './pages/OnboardingPage'
function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path={PATHS.LOGIN} element={<Login />} />
          <Route path={PATHS.SIGNUP} element={<SignUp />} />
          <Route path={PATHS.ONBOARDING} element={<Onboarding />} />
          <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
          <Route path={PATHS.HOME} element={
            <div>
              <h1>Hello World</h1>
            </div>
          } />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
