import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''

const TASA_REFERENCIA = 40

function PayPalSection({ monto, onEstado }) {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer()

  const createOrder = async () => {
    onEstado('Creando orden PayPal...')
    const respuesta = await fetch(`${API_BASE_URL}/api/pago/paypal/crear-orden`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monto }),
    })
    const data = await respuesta.json()
    if (data.orderId) {
      return data.orderId
    }
    throw new Error(data.error || 'No se pudo crear la orden PayPal.')
  }

  const onApprove = async (data) => {
    onEstado('Confirmando pago...')
    try {
      const respuesta = await fetch(`${API_BASE_URL}/api/pago/paypal/capturar-orden`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderID }),
      })
      const resultado = await respuesta.json()
      if (resultado.estado === 'COMPLETED') {
        onEstado('Pago con PayPal completado.')
      } else {
        onEstado(`Estado del pago: ${resultado.estado}`)
      }
    } catch {
      onEstado('Error al confirmar el pago con PayPal.')
    }
  }

  const onError = () => {
    onEstado('Error en el proceso de pago PayPal.')
  }

  if (!PAYPAL_CLIENT_ID) {
    return (
      <p className="paypal-unconfigured">
        PayPal no está configurado en este entorno.
      </p>
    )
  }

  if (isPending) return <p className="paypal-loading">Cargando PayPal...</p>
  if (isRejected) return <p className="paypal-unconfigured">No se pudo cargar PayPal.</p>

  if (isResolved) {
    return (
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        onCancel={() => onEstado('Pago con PayPal cancelado.')}
      />
    )
  }

  return null
}

function OpcionesPagoPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { monto = 450, descripcion = 'Hamburguesa con papas' } = location.state || {}

  const [estado, setEstado] = useState('Seleccioná un medio de pago.')
  const [metodoPago, setMetodoPago] = useState(null)

  const montoUSD = (monto / TASA_REFERENCIA).toFixed(2)

  const pagarConMercadoPago = async () => {
    setEstado('Generando orden de pago...')
    try {
      const respuesta = await fetch(`${API_BASE_URL}/api/pago/mercadopago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto, descripcion }),
      })
      const linkDePago = await respuesta.text()
      if (linkDePago.startsWith('http')) {
        setEstado('Redirigiendo a Mercado Pago...')
        window.location.href = linkDePago
      } else {
        setEstado('Error: el backend no devolvió un link válido.')
      }
    } catch (error) {
      console.error('Error de conexión:', error)
      setEstado('Error: no se pudo conectar con el servidor.')
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <img src="/logo-sabore.png" alt="Sabore" className="brand-logo" />
      </header>

      <main className="page-content">
        <div className="checkout-card">

          <div className="order-header">
            <p className="order-label">Opciones de pago</p>
            <p className="order-item-name">{descripcion}</p>
            <div className="order-amounts">
              <p className="order-amount">
                <span>$</span>{monto}
                <span className="order-amount-currency"> UYU</span>
              </p>
              <p className="order-amount-usd">≈ USD {montoUSD}</p>
            </div>
          </div>

          <div className="order-status">
            <p className="status-label">Estado</p>
            <p className="status-value">{estado}</p>
          </div>

          {metodoPago === null && (
            <div className="payment-options">
              <button
                type="button"
                className="btn btn-payment-option btn-mercadopago"
                onClick={() => { setMetodoPago('mp'); pagarConMercadoPago() }}
              >
                Mercado Pago
              </button>
              <button
                type="button"
                className="btn btn-payment-option btn-paypal"
                onClick={() => setMetodoPago('paypal')}
              >
                PayPal
              </button>
            </div>
          )}

          {metodoPago === 'paypal' && (
            <div className="paypal-container">
              <PayPalSection monto={monto} onEstado={setEstado} />
              <button
                className="btn btn-secondary btn-volver"
                onClick={() => { setMetodoPago(null); setEstado('Seleccioná un medio de pago.') }}
              >
                ← Volver a opciones
              </button>
            </div>
          )}

          <div className="actions actions--single">
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              ← Volver al pedido
            </button>
          </div>

        </div>
      </main>

      <p className="app-footer">Sabore Uruguay · Pagos seguros</p>
    </div>
  )
}

export default OpcionesPagoPage
