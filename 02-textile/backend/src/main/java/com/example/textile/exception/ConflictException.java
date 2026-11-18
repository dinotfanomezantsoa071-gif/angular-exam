package com.example.textile.exception;
// Signale un conflit, par exemple une donnée déjà utilisée.

public class ConflictException extends BusinessException {
    public ConflictException(String message) {
        super(message);
    }
}
