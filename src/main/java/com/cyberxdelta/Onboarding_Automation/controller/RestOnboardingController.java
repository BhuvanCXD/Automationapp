package com.cyberxdelta.Onboarding_Automation.controller;

import com.cyberxdelta.Onboarding_Automation.dto.OnboardingRequestDTO;
import com.cyberxdelta.Onboarding_Automation.service.OnboardingOrchestrationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/onboard")
public class RestOnboardingController {

    @Autowired
    private OnboardingOrchestrationService orchestrationService;

    @Autowired
    private com.cyberxdelta.Onboarding_Automation.repository.AssetRepository assetRepository;

    @PostMapping
    public Mono<ResponseEntity<Map<String, String>>> onboard(
            @Valid @RequestBody OnboardingRequestDTO request,
            org.springframework.security.core.Authentication authentication) {

        String username = (authentication != null) ? authentication.getName() : "anonymous";
        log.info("User: {} | Request: onboard application [{}]", username, request.getApplicationName());

        return orchestrationService.onboardApplication(request)
                .flatMap(jsonResult -> {
                    // Persist the asset metadata
                    com.cyberxdelta.Onboarding_Automation.entity.Asset asset = new com.cyberxdelta.Onboarding_Automation.entity.Asset();
                    asset.setApplicationName(request.getApplicationName());
                    asset.setProtocol(request.getProtocol());
                    asset.setIdentityProvider(request.getIdentityProvider());
                    asset.setRedirectUri(request.getRedirectUri());
                    asset.setAccessType(request.getAccessType());
                    asset.setGroupName(request.getGroupName());
                    asset.setUsername(username);

                    // Advanced metadata persistence
                    asset.setClientId(request.getClientId());
                    asset.setClientSecret(request.getClientSecret());
                    asset.setScopes(request.getScopes());
                    asset.setGrantTypes(request.getGrantTypes());
                    asset.setPostLogoutRedirectUri(request.getPostLogoutRedirectUri());
                    asset.setEntityId(request.getEntityId());
                    asset.setAcsUrl(request.getAcsUrl());
                    asset.setNameIdFormat(request.getNameIdFormat());
                    asset.setAttributeMapping(request.getAttributeMapping());
                    asset.setDiscoveryUrl(request.getDiscoveryUrl());

                    assetRepository.save(asset);
                    log.info("Asset saved to database: {}", request.getApplicationName());

                    Map<String, String> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("message", "Application onboarded successfully");
                    return Mono.just(ResponseEntity.ok(response));
                })
                .onErrorResume(e -> {
                    log.error("Onboarding failed", e);
                    Map<String, String> response = new HashMap<>();
                    response.put("status", "error");
                    response.put("message", e.getMessage());
                    return Mono.just(ResponseEntity.status(500).body(response));
                });
    }
}
