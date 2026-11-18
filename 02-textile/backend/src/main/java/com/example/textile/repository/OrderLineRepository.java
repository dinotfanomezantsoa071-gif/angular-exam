package com.example.textile.repository;
// Accès JPA aux lignes des commandes.

import com.example.textile.entity.OrderLine;
import org.springframework.data.jpa.repository.*;

public interface OrderLineRepository extends JpaRepository<OrderLine, Long>, JpaSpecificationExecutor<OrderLine> {
}
