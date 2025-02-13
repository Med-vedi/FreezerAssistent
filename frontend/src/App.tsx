import './App.css'
import MainLayout from './layout/MainLayout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Dashboard from './pages/Dashboard'
import { PATHS } from './constants/paths'
function App() {
  return (
    <BrowserRouter>
      <MainLayout      >
        <Routes>
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.SIGNUP} element={<SignUpPage />} />
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
