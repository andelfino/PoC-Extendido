import { useNavigate } from 'react-router-dom'

const MONTO = 450
const DESCRIPCION = 'Hamburguesa con papas'

function PedidoPage() {
  const navigate = useNavigate()

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
            <p className="order-item-name">{DESCRIPCION}</p>
            <p className="order-amount">
              <span>$</span>{MONTO}
            </p>
          </div>

          <div className="actions actions--single">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/opciones-pago', { state: { monto: MONTO, descripcion: DESCRIPCION } })}
            >
              Pagar
            </button>
          </div>
        </div>
      </main>

      <p className="app-footer">Sabore Uruguay · Pagos seguros</p>
    </div>
  )
}

export default PedidoPage
