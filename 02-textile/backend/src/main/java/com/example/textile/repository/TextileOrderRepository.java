package com.example.textile.repository;
// Accès JPA aux commandes textiles et à leurs filtres.

import com.example.textile.entity.TextileOrder;
import org.springframework.data.jpa.repository.*;

public interface TextileOrderRepository
        extends JpaRepository<TextileOrder, Long>, JpaSpecificationExecutor<TextileOrder> {
}
