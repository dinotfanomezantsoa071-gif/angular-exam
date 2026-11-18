package com.example.livraison.mapper;

import com.example.livraison.entity.Deliverer;
import com.example.livraison.dto.request.DelivererRequest;
import com.example.livraison.dto.response.DelivererResponse;

public final class DelivererMapper {
    // Convertit les données livreur entre API et entité JPA.
    private DelivererMapper() {
    }

    public static DelivererResponse response(Deliverer e) {
        return new DelivererResponse(e.getId(), e.getVersion(), e.getName(), e.getPhone(), e.getVehicle(), e.getZone(),
                e.getMaxWeight(), e.getMaxVolume(), e.getDistanceToPickup(), e.getMaxDeliveries(), e.getStatus());
    }

    public static void apply(DelivererRequest r, Deliverer e) {
        e.setName(r.name());
        e.setPhone(r.phone());
        e.setVehicle(r.vehicle());
        e.setZone(r.zone());
        e.setMaxWeight(r.maxWeight());
        e.setMaxVolume(r.maxVolume());
        e.setDistanceToPickup(r.distanceToPickup());
        e.setMaxDeliveries(r.maxDeliveries());
        e.setStatus(r.status());
    }
}
