package com.example.textile.exception;
// Signale qu'un enregistrement demandé n'existe pas.

public class ResourceNotFoundException extends BusinessException {public ResourceNotFoundException(String message) {super(message);}}
