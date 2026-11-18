package com.example.textile.dto.response;
// Données produit renvoyées à l'API ou à l'interface.

import java.time.*;
import java.math.*;
import java.util.*;

public record ProductResponse(Long id, Long version, String name, String reference, String description,
        BigDecimal unitPrice) {
}
