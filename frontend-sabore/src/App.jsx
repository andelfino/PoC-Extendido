import { useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function App() {
  const [mensaje, setMensaje] = useState("Esperando acción...")

  // FUNCIÓN PRINCIPAL: Conecta con Mercado Pago a través de Java
  const pagarConMercadoPago = async () => {
    setMensaje("⏳ Generando orden de pago...");

    try {
      // 1. Llamada al Backend (que IntelliJ esté en 'Play')
      const respuesta = await fetch(`${API_BASE_URL}/api/pago/mercadopago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          monto: 450, 
          descripcion: "Hamburguesa con papas - Sabore" 
        })
      });

      // 2. Recibimos el link "init_point" que generó Java
      const linkDePago = await respuesta.text();

      if (linkDePago.startsWith("http")) {
        setMensaje("✅ Redirigiendo a Mercado Pago...");
        
        // 3. Redirección automática a la pantalla de pago de Uruguay
        window.location.href = linkDePago; 
      } else {
        setMensaje("❌ Error: El backend no devolvió un link válido.");
      }

    } catch (error) {
      console.error("Error de conexión:", error);
      setMensaje("❌ Error: No se pudo conectar con el servidor Java.");
    }
  };

  // Función simple para ver qué estamos comprando
  const verDetallePedido = () => {
    setMensaje("🍔 Hamburguesa con papas - $450");
  };

  return (
    <>
      <header>
        <h1>Sabor & Entrega 🍕</h1>
        <p>Tu comida favorita, a un clic.</p>
      </header>
      
      <div className="card">
        <div className="pedido-info">
          <p>Estado actual: <strong>{mensaje}</strong></p>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          <button 
            onClick={verDetallePedido}
            style={{ background: '#f4f4f4', color: '#333' }}
          >
            Ver Detalle
          </button>

          <button 
            onClick={pagarConMercadoPago} 
            style={{ 
              background: '#009EE3', // Color oficial de Mercado Pago
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Pagar con Mercado Pago
          </button>
        </div>
      </div>

      <footer style={{ marginTop: '40px', opacity: 0.6 }}>
        <p className="read-the-docs">Sistema de Pagos Seguro - Sabore Uruguay</p>
      </footer>
    </>
  )
}

export default App