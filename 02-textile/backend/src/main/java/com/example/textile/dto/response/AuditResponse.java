package com.example.textile.dto.response;
// Action d'historique renvoyée lors de la consultation.

import java.time.LocalDateTime;

public record AuditResponse(String action, String actor, LocalDateTime occurredAt) {
}
