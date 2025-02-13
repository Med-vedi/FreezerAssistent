import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import theme from './themeConfig.ts'
import 'antd/dist/reset.css'
import { IntlConfig } from './IntlConfig.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlConfig>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </IntlConfig>
  </StrictMode>,
)
