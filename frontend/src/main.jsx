import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: 'rgba(18,15,30,0.95)',
          border: '1px solid rgba(232,99,122,0.2)',
          color: '#f5ede8',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '0.82rem',
          borderRadius: '12px',
        },
      }}
    />
  </React.StrictMode>
)