package com.example.livraison.dto.response;
// Indicateurs et résultats regroupés pour les statistiques.

import java.util.Map;

public record AnalyticsResponse(Map<String, Number> metrics, Map<String, Map<String, Number>> groups) {
}
