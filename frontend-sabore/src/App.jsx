import { useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function App() {
  const [estado, setEstado] = useState('Esperando acción...')

  const pagarConMercadoPago = async () => {
    setEstado('Generando orden de pago...')

    try {
      const respuesta = await fetch(`${API_BASE_URL}/api/pago/mercadopago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monto: 450,
          descripcion: 'Hamburguesa con papas - Sabore'
        })
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

  const verDetalle = () => {
    setEstado('Hamburguesa con papas · $450')
  }

  return (
    <div className="page">
      <header className="page-header">
        <img
          src="/logo-sabore.png"
          alt="Sabore"
          className="brand-logo"
        />
      </header>

      <main className="page-content">
        <div className="checkout-card">
          <div className="order-header">
            <p className="order-label">Pedido actual</p>
            <p className="order-item-name">Hamburguesa con papas</p>
            <p className="order-amount">
              <span>$</span>450
            </p>
          </div>

          <div className="order-status">
            <p className="status-label">Estado</p>
            <p className="status-value">{estado}</p>
          </div>

          <div className="actions">
            <button className="btn btn-secondary" onClick={verDetalle}>
              Ver detalle
            </button>
            <button className="btn btn-primary" onClick={pagarConMercadoPago}>
              Pagar con Mercado Pago
            </button>
          </div>
        </div>
      </main>

      <p className="app-footer">Sabore Uruguay · Pagos seguros</p>
    </div>
  )
}

export default App
