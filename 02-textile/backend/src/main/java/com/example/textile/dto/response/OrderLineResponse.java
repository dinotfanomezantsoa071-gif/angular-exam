package com.example.textile.dto.response;
// Données d'une ligne de commande renvoyées par l'API.

import java.time.*;
import java.math.*;
import java.util.*;

public record OrderLineResponse(Long id, Long version, Long orderId, Long productId, Integer quantity, String size,
        String color, BigDecimal unitPrice, Integer producedQuantity) {
}
