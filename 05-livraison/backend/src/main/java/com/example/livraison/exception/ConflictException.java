package com.example.livraison.exception;
// Signale un conflit avec une donnée existante ou utilisée.

public class ConflictException extends BusinessException {
    public ConflictException(String message) {
        super(message);
    }
}
