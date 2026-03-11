package com.cyberxdelta.Onboarding_Automation.controller;

import com.cyberxdelta.Onboarding_Automation.entity.Asset;
import com.cyberxdelta.Onboarding_Automation.repository.AssetRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/assets")
public class AssetController {

    @Autowired
    private AssetRepository assetRepository;

    @GetMapping
    public ResponseEntity<List<Asset>> getAssets(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        log.info("Fetching assets for user: {}", username);

        List<Asset> assets = assetRepository.findByUsername(username);

        return ResponseEntity.ok(assets);
    }

    @PostMapping
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        String username = authentication.getName();
        asset.setUsername(username);
        Asset saved = assetRepository.save(asset);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAsset(@org.springframework.web.bind.annotation.PathVariable Long id,
            Authentication authentication) {
        if (authentication == null)
            return ResponseEntity.status(401).build();
        return assetRepository.findById(id)
                .filter(a -> a.getUsername().equals(authentication.getName()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id, Authentication authentication) {
        if (authentication == null)
            return ResponseEntity.status(401).build();
        return assetRepository.findById(id)
                .filter(a -> a.getUsername().equals(authentication.getName()))
                .map(a -> {
                    assetRepository.delete(a);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
