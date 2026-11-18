package com.example.livraison.dto.response;
// Données client renvoyées à l'API ou à l'interface.

import java.time.*;
import java.math.*;
import java.util.*;
public record ClientResponse(Long id, Long version, String name, String email, String phone, String address) {}
