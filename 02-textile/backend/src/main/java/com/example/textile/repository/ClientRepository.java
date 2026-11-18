package com.example.textile.repository;
// Accès JPA aux clients.

import com.example.textile.entity.Client;
import org.springframework.data.jpa.repository.*;

public interface ClientRepository extends JpaRepository<Client, Long>, JpaSpecificationExecutor<Client> {
}
