import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import theme from './themeConfig.ts'
import 'antd/dist/reset.css'
import { IntlConfig } from './IntlConfig.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <IntlConfig>
        <AuthProvider>
          <ConfigProvider theme={theme}>
            <App />
          </ConfigProvider>
        </AuthProvider>
      </IntlConfig>
    </Suspense>
  </StrictMode>,
)
