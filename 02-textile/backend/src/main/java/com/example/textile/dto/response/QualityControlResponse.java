package com.example.textile.dto.response;
// Résultat du contrôle qualité renvoyé par l'API.

import java.time.*;
import java.math.*;
import java.util.*;

public record QualityControlResponse(Long id, Long version, Long orderId, String result, String responsible,
        String comment, LocalDateTime checkedAt) {
}
