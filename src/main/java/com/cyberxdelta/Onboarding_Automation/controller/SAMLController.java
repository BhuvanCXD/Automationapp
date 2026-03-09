package com.cyberxdelta.Onboarding_Automation.controller;

import com.cyberxdelta.Onboarding_Automation.client.PingOneApiClient;
import com.cyberxdelta.Onboarding_Automation.dto.SamlAppRequestDto;
import com.cyberxdelta.Onboarding_Automation.dto.SamlAppResponseDto;
import com.cyberxdelta.Onboarding_Automation.service.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/saml")
public class SAMLController {
    private static final Logger logger = LoggerFactory.getLogger(SAMLController.class);

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PingOneApiClient pingOneApiClient;

@PostMapping("/create")
public Mono<ResponseEntity<SamlAppResponseDto>> createSamlApp(@RequestBody SamlAppRequestDto requestDto) {
    logger.info("Received request to create SAML application: {}", requestDto.getName());
    logger.info("Request details: protocol={}, type={}, spEntityId={}, acsUrls={}",
        requestDto.getProtocol(), requestDto.getType(), requestDto.getSpEntityId(), requestDto.getAcsUrls());

    // Validate required fields
    if (requestDto.getName() == null || requestDto.getName().trim().isEmpty()) {
        logger.error("Application name is required");
        return Mono.just(ResponseEntity.badRequest().build());
    }

    if (requestDto.getProtocol() == null || requestDto.getProtocol().trim().isEmpty()) {
        logger.error("Protocol is required");
        return Mono.just(ResponseEntity.badRequest().build());
    }

    // Ensure protocol is uppercase
    requestDto.setProtocol(requestDto.getProtocol().toUpperCase());

    // Validate SAML fields for SAML protocol
    if ("SAML".equalsIgnoreCase(requestDto.getProtocol())) {
        if (requestDto.getAcsUrls() == null || requestDto.getAcsUrls().isEmpty()) {
            logger.error("ACS URLs are required for SAML applications");
            return Mono.just(ResponseEntity.badRequest().build());
        }

        if (requestDto.getSpEntityId() == null || requestDto.getSpEntityId().trim().isEmpty()) {
            logger.error("SP Entity ID is required for SAML applications");
            return Mono.just(ResponseEntity.badRequest().build());
        }

        // Set default type for SAML applications
        if (requestDto.getType() == null || requestDto.getType().trim().isEmpty()) {
            requestDto.setType("WEB_APP");
        }
    }

    logger.info("SAML application validation passed. Proceeding to create in PingOne.");
    return tokenService.getAccessToken()
            .doOnNext(token -> logger.info("Successfully obtained access token"))
            .doOnError(error -> logger.error("Failed to get access token: {}", error.getMessage()))
            .flatMap(token -> {
                logger.info("Calling PingOne API with token: {}...", token.substring(0, 20) + "...");
                return pingOneApiClient.createSamlApplication(token, requestDto);
            })
            .map(response -> {
                logger.info("SAML application created successfully: {}", response.getApplicationId());
                return ResponseEntity.ok(response);
            })
            .onErrorResume(e -> {
                logger.error("Error creating SAML application: {}", e.getMessage(), e);
                return Mono.just(ResponseEntity.badRequest().build());
            });
}
}
