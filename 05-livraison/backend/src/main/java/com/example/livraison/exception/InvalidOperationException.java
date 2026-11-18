package com.example.livraison.exception;
// Signale une action interdite par les règles métier.

public class InvalidOperationException extends BusinessException {
    public InvalidOperationException(String message) {
        super(message);
    }
}
