package com.example.livraison.repository;
// Accès JPA aux commandes de livraison et à leurs filtres.

import com.example.livraison.entity.DeliveryOrder;
import org.springframework.data.jpa.repository.*;

public interface DeliveryOrderRepository
        extends JpaRepository<DeliveryOrder, Long>, JpaSpecificationExecutor<DeliveryOrder> {
}
