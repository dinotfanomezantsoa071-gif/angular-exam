package com.example.livraison.mapper;

import com.example.livraison.entity.Client;
import com.example.livraison.dto.request.ClientRequest;
import com.example.livraison.dto.response.ClientResponse;

public final class ClientMapper {
    // Convertit les données client entre API et entité JPA.
    private ClientMapper() {
    }

    public static ClientResponse response(Client e) {
        return new ClientResponse(e.getId(), e.getVersion(), e.getName(), e.getEmail(), e.getPhone(), e.getAddress());
    }

    public static void apply(ClientRequest r, Client e) {
        e.setName(r.name());
        e.setEmail(r.email());
        e.setPhone(r.phone());
        e.setAddress(r.address());
    }
}
