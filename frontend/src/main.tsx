import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import theme from './themeConfig.ts'
import 'antd/dist/reset.css'
import { IntlConfig } from './IntlConfig.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { store } from './store/index.ts'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
        <IntlConfig>
          <AuthProvider >
            <ConfigProvider theme={theme}>
              <App />
            </ConfigProvider>
          </AuthProvider>
        </IntlConfig>
      </Provider>
    </Suspense>
  </StrictMode>
)
