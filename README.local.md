# Configuración local — Sabore

Esta guía explica cómo configurar el proyecto en tu propia máquina sin tocar el código fuente.

---

## Backend (Java + Spring Boot)

El backend lee toda su configuración desde **variables de entorno**.
Podés definirlas en tu sistema operativo, en tu terminal o en tu IDE
antes de arrancar la aplicación.

### Variables disponibles

| Variable | Descripción | Ejemplo |
|---|---|---|
| `SPRING_DATASOURCE_URL` | URL JDBC de tu base PostgreSQL | `jdbc:postgresql://localhost:5432/contenedor_1` |
| `SPRING_DATASOURCE_USERNAME` | Usuario de PostgreSQL | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de PostgreSQL | `tu_contraseña` |
| `APP_CORS_ALLOWED_ORIGIN` | Origen del frontend que puede llamar al backend | `http://localhost:5173` |
| `APP_MERCADOPAGO_ACCESS_TOKEN` | Tu Access Token de **prueba** de Mercado Pago | `TEST-...` |
| `APP_PAYPAL_CLIENT_ID` | Client ID de tu app PayPal sandbox | `AaBb...XxYy` |
| `APP_PAYPAL_CLIENT_SECRET` | Client Secret de tu app PayPal sandbox | `EeFF...ZzAa` |
| `APP_PAYPAL_BASE_URL` | Base URL de la API PayPal (default: sandbox) | `https://api-m.sandbox.paypal.com` |
| `APP_UYU_TO_USD_RATE` | Tasa de conversión UYU→USD (default: 40) | `40` |

> **SPRING_DATASOURCE_URL** y **SPRING_DATASOURCE_USERNAME** tienen valores por defecto
> (`jdbc:postgresql://localhost:5432/contenedor_1` y `postgres`).
> **SPRING_DATASOURCE_PASSWORD** y **APP_MERCADOPAGO_ACCESS_TOKEN** no tienen default;
> si no se definen, el backend falla al intentar usarlos.
>
> **APP_PAYPAL_CLIENT_ID**, **APP_PAYPAL_CLIENT_SECRET** y **APP_UYU_TO_USD_RATE** son
> opcionales para arrancar. Si las credenciales PayPal están vacías, el endpoint devuelve
> un error descriptivo y el frontend muestra "PayPal no está configurado".

### Cómo obtener tu Access Token de prueba de Mercado Pago

1. Entrá a [https://www.mercadopago.com.uy/developers](https://www.mercadopago.com.uy/developers).
2. Seleccioná tu aplicación (o creá una nueva).
3. En "Credenciales" → elegí **Prueba**.
4. Copiá el **Access token** que empieza con `APP_USR-...` y pegalo en `APP_MERCADOPAGO_ACCESS_TOKEN`.

---

### Cómo configurar PayPal Sandbox

1. Entrá a [https://developer.paypal.com](https://developer.paypal.com) con tu cuenta PayPal.
2. Ir a **Apps & Credentials** → pestaña **Sandbox**.
3. Hacé clic en **Create App**, poné un nombre (ej. `sabore-sandbox`) y seleccioná **Merchant**.
4. En la pantalla de la app vas a ver el **Client ID** y el **Secret** (click en "Show").
5. Copiá ambos valores y configurá las variables de entorno:
   - `APP_PAYPAL_CLIENT_ID` = Client ID copiado
   - `APP_PAYPAL_CLIENT_SECRET` = Secret copiado
   - `VITE_PAYPAL_CLIENT_ID` = el mismo Client ID (también en `.env.local` del frontend)

#### Cuentas de prueba (buyer / seller)

PayPal crea automáticamente dos cuentas sandbox al crear tu Developer Account:
- Una cuenta **business** (seller) — la usás como merchant.
- Una cuenta **personal** (buyer) — la usás para simular pagos.

Para verlas: **Testing** → **Sandbox accounts** en el panel de developer.paypal.com.
Desde ahí podés obtener la contraseña de la cuenta buyer para hacer pagos de prueba.
También podés agregar una **tarjeta de crédito de prueba** desde la configuración de la cuenta buyer.

---

## Frontend (React + Vite)

El frontend lee la URL del backend desde un archivo de variables de entorno local.

1. Copiá el archivo de ejemplo:
   ```
   cd frontend-sabore
   copy .env.example .env.local   # Windows
   # o en Linux/Mac:
   cp .env.example .env.local
   ```
2. Abrí `.env.local` y cambiá el valor si tu backend corre en otro puerto o máquina:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

> `.env.local` está en `.gitignore`; cada desarrollador mantiene el suyo sin pisar el de los demás.

### Puertos por defecto

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

Si alguno de esos puertos está ocupado en tu máquina, podés cambiarlo localmente sin tocar el código fuente.

---

## Compatibilidad Java

El proyecto compila con **Java 17** (declarado en `pom.xml`).
Podés usarlo con **JDK 17** o **JDK 21** sin cambiar nada más.

Si tenés varios JDK instalados, verificá cuál está usando tu IDE o terminal antes de arrancar el backend.

---

## Resumen de pasos para arrancar por primera vez

1. Definí las variables de entorno del backend (IDE o `.env`).
2. Copiá `.env.example` a `.env.local` en `frontend-sabore/` y ajustá la URL.
3. Levantá primero el backend con tu IDE o desde terminal.
4. Levantá el frontend con `npm run dev` dentro de `frontend-sabore/`.
