package com.example.livraison.repository;
// Accès JPA aux colis.

import com.example.livraison.entity.Parcel;
import org.springframework.data.jpa.repository.*;

public interface ParcelRepository extends JpaRepository<Parcel, Long>, JpaSpecificationExecutor<Parcel> {
}
