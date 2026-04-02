package com.app.backend_sabore;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;

@RestController
public class GetPostController {
    @Value("${app.mercadopago.access-token}")
    private String mercadoPagoAccessToken;

    @GetMapping("/api/saludo")
    public Map<String, String> obtenerSaludo() {
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "¡Hola Sabore! El Backend y el Frontend ya se hablan.");
        return respuesta;
    }

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
}