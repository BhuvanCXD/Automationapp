package com.cyberxdelta.Onboarding_Automation.repository;

import com.cyberxdelta.Onboarding_Automation.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByUsername(String username);
}
