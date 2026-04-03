import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import PedidoPage from './pages/PedidoPage'
import OpcionesPagoPage from './pages/OpcionesPagoPage'

const router = createBrowserRouter([
  { path: '/', element: <PedidoPage /> },
  { path: '/opciones-pago', element: <OpcionesPagoPage /> },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
