package com.example.livraison.dto.response;
// Données livreur renvoyées à l'API ou à l'interface.

import java.time.*;
import java.math.*;
import java.util.*;

public record DelivererResponse(Long id, Long version, String name, String phone, String vehicle, String zone,
        BigDecimal maxWeight, BigDecimal maxVolume, BigDecimal distanceToPickup, Integer maxDeliveries, String status) {
}
