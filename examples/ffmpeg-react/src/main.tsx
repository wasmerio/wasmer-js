import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WasmerSDK } from './hooks.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WasmerSDK>
      <App />
    </WasmerSDK>
  </React.StrictMode>,
)
