package com.example.livraison.dto.request;
// Données reçues pour créer ou modifier un client.

import java.time.*;
import java.math.*;
import java.util.*;
import jakarta.validation.constraints.*;

public record ClientRequest(
        @NotBlank @Size(max = 2000) String name,
        @NotBlank @Size(max = 2000) @Email String email,
        @NotBlank @Size(max = 2000) String phone,
        @NotBlank @Size(max = 2000) String address) {
}
