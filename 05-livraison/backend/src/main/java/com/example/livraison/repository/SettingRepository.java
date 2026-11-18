package com.example.livraison.repository;
// Accès JPA aux paramètres métier.

import com.example.livraison.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingRepository extends JpaRepository<Setting, String> {
}
