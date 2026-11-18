package com.example.livraison.dto.request;
// Données reçues pour créer ou modifier un livreur.

import java.time.*;
import java.math.*;
import java.util.*;
import jakarta.validation.constraints.*;

public record DelivererRequest(
        @NotBlank @Size(max = 2000) String name,
        @NotBlank @Size(max = 2000) String phone,
        @NotBlank @Size(max = 2000) String vehicle,
        @NotBlank @Size(max = 2000) String zone,
        @NotNull @Positive BigDecimal maxWeight,
        @NotNull @Positive BigDecimal maxVolume,
        @NotNull @PositiveOrZero BigDecimal distanceToPickup,
        @NotNull @Positive Integer maxDeliveries,
        @NotBlank @Size(max = 2000) @Pattern(regexp = "DISPONIBLE|EN_LIVRAISON|INDISPONIBLE|PAUSE") String status) {
}
