package com.example.textile.dto.response;
// Paramètre métier présenté avec un libellé lisible.

public record SettingResponse(String name, String label, double value) {
}
