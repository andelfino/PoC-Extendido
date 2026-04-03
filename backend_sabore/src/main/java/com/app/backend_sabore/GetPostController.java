package com.app.backend_sabore;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;

import com.paypal.sdk.PaypalServerSdkClient;
import com.paypal.sdk.Environment;
import com.paypal.sdk.authentication.ClientCredentialsAuthModel;
import com.paypal.sdk.controllers.OrdersController;
import com.paypal.sdk.models.AmountWithBreakdown;
import com.paypal.sdk.models.CaptureOrderInput;
import com.paypal.sdk.models.CheckoutPaymentIntent;
import com.paypal.sdk.models.CreateOrderInput;
import com.paypal.sdk.models.Order;
import com.paypal.sdk.models.OrderRequest;
import com.paypal.sdk.models.PurchaseUnitRequest;

@RestController
public class GetPostController {

    @Value("${app.mercadopago.access-token}")
    private String mercadoPagoAccessToken;

    @Value("${app.paypal.client-id:}")
    private String paypalClientId;

    @Value("${app.paypal.client-secret:}")
    private String paypalClientSecret;

    @Value("${app.paypal.base-url:https://api-m.sandbox.paypal.com}")
    private String paypalBaseUrl;

    @Value("${app.conversion.uyu-to-usd-rate:40}")
    private BigDecimal uyuToUsdRate;

    @GetMapping("/api/saludo")
    public Map<String, String> obtenerSaludo() {
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "¡Hola Sabore! El Backend y el Frontend ya se hablan.");
        return respuesta;
    }

    // ── MercadoPago (intacto) ──────────────────────────────────────────────────

    @PostMapping("/api/pago/mercadopago")
    public String crearCobro(@RequestBody Map<String, Object> datos) {
        try {
            MercadoPagoConfig.setAccessToken(mercadoPagoAccessToken);

            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title("Pedido Sabore")
                    .quantity(1)
                    .unitPrice(new BigDecimal(datos.get("monto").toString()))
                    .currencyId("UYU")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(Collections.singletonList(itemRequest))
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);
            return preference.getInitPoint();

        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // ── PayPal: helpers ────────────────────────────────────────────────────────

    private PaypalServerSdkClient buildPayPalClient() {
        Environment env = paypalBaseUrl.contains("sandbox")
                ? Environment.SANDBOX
                : Environment.PRODUCTION;
        return new PaypalServerSdkClient.Builder()
                .clientCredentialsAuth(new ClientCredentialsAuthModel.Builder(
                        paypalClientId, paypalClientSecret).build())
                .environment(env)
                .build();
    }

    // ── PayPal: crear orden ────────────────────────────────────────────────────

    @PostMapping("/api/pago/paypal/crear-orden")
    public ResponseEntity<Map<String, Object>> crearOrdenPayPal(@RequestBody Map<String, Object> datos) {
        Map<String, Object> respuesta = new HashMap<>();

        if (paypalClientId == null || paypalClientId.isBlank()) {
            respuesta.put("error", "PayPal no está configurado en este entorno.");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(respuesta);
        }

        try {
            BigDecimal montoUYU = new BigDecimal(datos.get("monto").toString());
            BigDecimal montoUSD = montoUYU.divide(uyuToUsdRate, 2, RoundingMode.HALF_UP);

            AmountWithBreakdown amount = new AmountWithBreakdown.Builder("USD", montoUSD.toPlainString())
                    .build();

            PurchaseUnitRequest purchaseUnit = new PurchaseUnitRequest.Builder(amount)
                    .description("Pedido Sabore")
                    .build();

            OrderRequest orderRequest = new OrderRequest.Builder(
                    CheckoutPaymentIntent.CAPTURE,
                    List.of(purchaseUnit))
                    .build();

            CreateOrderInput input = new CreateOrderInput.Builder(null, orderRequest).build();

            OrdersController ordersController = buildPayPalClient().getOrdersController();
            Order order = ordersController.createOrderAsync(input).get().getResult();

            respuesta.put("orderId", order.getId());
            respuesta.put("montoUSD", montoUSD.toPlainString());
            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

    // ── PayPal: capturar orden ─────────────────────────────────────────────────

    @PostMapping("/api/pago/paypal/capturar-orden")
    public ResponseEntity<Map<String, Object>> capturarOrdenPayPal(@RequestBody Map<String, Object> datos) {
        Map<String, Object> respuesta = new HashMap<>();

        if (paypalClientId == null || paypalClientId.isBlank()) {
            respuesta.put("error", "PayPal no está configurado en este entorno.");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(respuesta);
        }

        try {
            String orderId = datos.get("orderId").toString();

            CaptureOrderInput input = new CaptureOrderInput.Builder(orderId, null).build();

            OrdersController ordersController = buildPayPalClient().getOrdersController();
            Order order = ordersController.captureOrderAsync(input).get().getResult();

            respuesta.put("estado", order.getStatus().toString());
            respuesta.put("orderId", order.getId());
            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
}