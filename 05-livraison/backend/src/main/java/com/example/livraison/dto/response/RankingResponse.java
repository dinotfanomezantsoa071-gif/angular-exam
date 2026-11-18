package com.example.livraison.dto.response;
// Résultat de classement renvoyé par le backend.

public record RankingResponse(Long teamId, String name, int played, int wins, int draws, int losses, int points,
        int goalsFor, int goalsAgainst, int difference) {
}
