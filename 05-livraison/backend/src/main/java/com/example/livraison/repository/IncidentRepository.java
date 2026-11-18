package com.example.livraison.repository;
// Accès JPA aux incidents de livraison.

import com.example.livraison.entity.Incident;
import org.springframework.data.jpa.repository.*;

public interface IncidentRepository extends JpaRepository<Incident, Long>, JpaSpecificationExecutor<Incident> {
}
