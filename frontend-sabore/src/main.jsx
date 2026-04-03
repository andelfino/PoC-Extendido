import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import './index.css'
import App from './App.jsx'

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PayPalScriptProvider
      options={{ clientId: paypalClientId || 'sb', currency: 'USD' }}
      deferLoading={!paypalClientId}
    >
      <App />
    </PayPalScriptProvider>
  </StrictMode>,
)
