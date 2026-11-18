package com.example.textile.repository;
// Accès JPA aux étapes de fabrication.

import com.example.textile.entity.ProductionStep;
import org.springframework.data.jpa.repository.*;

public interface ProductionStepRepository
        extends JpaRepository<ProductionStep, Long>, JpaSpecificationExecutor<ProductionStep> {
}
