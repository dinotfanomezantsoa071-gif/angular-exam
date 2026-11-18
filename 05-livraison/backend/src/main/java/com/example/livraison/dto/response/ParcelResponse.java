package com.example.livraison.dto.response;
// Données d'un colis renvoyées par l'API.

import java.time.*;
import java.math.*;
import java.util.*;

public record ParcelResponse(Long id, Long version, Long orderId, String reference, String description,
        BigDecimal weight, BigDecimal volume) {
}
