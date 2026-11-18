package com.example.textile.exception;
// Erreur de base pour les problèmes métier.

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
