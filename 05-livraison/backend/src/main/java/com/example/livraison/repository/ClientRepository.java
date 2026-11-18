package com.example.livraison.repository;
// Accès JPA aux clients.

import com.example.livraison.entity.Client;
import org.springframework.data.jpa.repository.*;

public interface ClientRepository extends JpaRepository<Client, Long>, JpaSpecificationExecutor<Client> {
}
