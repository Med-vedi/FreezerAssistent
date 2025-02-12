import './App.css'
import MainLayout from './layout/MainLayout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={
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
