# Sabore PoC

Prueba de concepto con:

- backend Java + Spring Boot
- frontend React + Vite
- PostgreSQL
- Checkout Pro de Mercado Pago en modo prueba

## Estructura

- `backend_sabore`: API y creación de preferencias de pago
- `frontend-sabore`: interfaz web y redirección al checkout
- `README.local.md`: guía de configuración local

## Requisitos

- Java 17 o Java 21
- PostgreSQL
- Node.js y npm
- una app de Mercado Pago Developers con credenciales de prueba

## Configuración local

La configuración sensible no se guarda en el código fuente.

- Backend: usa variables de entorno para base de datos, CORS y Mercado Pago
- Frontend: usa `frontend-sabore/.env.local`

Leé `README.local.md` para el detalle completo.

## Arranque rápido

1. Configurá las variables del backend.
2. Copiá `frontend-sabore/.env.example` a `frontend-sabore/.env.local`.
3. Levantá PostgreSQL.
4. Iniciá el backend.
5. Iniciá el frontend con `npm run dev` dentro de `frontend-sabore`.

## Notas

- Los valores por defecto esperan backend en `8080` y frontend en `5173`.
- Si esos puertos están ocupados, cada desarrollador puede cambiarlos localmente.
- El flujo de Mercado Pago está preparado para pruebas, no para producción.
