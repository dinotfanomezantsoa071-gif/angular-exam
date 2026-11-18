package com.example.textile.repository;
// Accès JPA aux paramètres métier.

import com.example.textile.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingRepository extends JpaRepository<Setting, String> {
}
