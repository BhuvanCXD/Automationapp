package com.cyberxdelta.Onboarding_Automation.repository;

import com.cyberxdelta.Onboarding_Automation.entity.ApplicationConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationConfigRepository extends JpaRepository<ApplicationConfig, Long> {
    List<ApplicationConfig> findByOwnerUsername(String ownerUsername);
}
