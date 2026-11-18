package com.example.textile.repository;
// Accès JPA aux produits textiles.

import com.example.textile.entity.Product;
import org.springframework.data.jpa.repository.*;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
}
