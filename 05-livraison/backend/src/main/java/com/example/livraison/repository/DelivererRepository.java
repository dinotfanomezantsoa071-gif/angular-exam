package com.example.livraison.repository;
// Accès JPA aux livreurs.

import com.example.livraison.entity.Deliverer;
import org.springframework.data.jpa.repository.*;

public interface DelivererRepository extends JpaRepository<Deliverer, Long>, JpaSpecificationExecutor<Deliverer> {
}
