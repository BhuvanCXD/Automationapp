package com.cyberxdelta.Onboarding_Automation.service;

import com.cyberxdelta.Onboarding_Automation.config.PingOneConfig;
import com.cyberxdelta.Onboarding_Automation.dto.OnboardingRequestDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Slf4j
@Service
public class OnboardingOrchestrationService {

    @Autowired
    private PingOneTokenService tokenService;

    @Autowired
    private PingOneProvisioningService provisioningService;

    @Autowired
    private PingOneConfig config;

    @Autowired
    private ObjectMapper objectMapper;

    public Mono<JsonNode> onboardApplication(OnboardingRequestDTO request) {
        log.info("Starting onboarding for: {} | Protocol: {} | EnvId: {}",
                request.getApplicationName(), request.getProtocol(), config.getEnvironmentId());

        // Validation
        if ("GROUP".equals(request.getAccessType())
                && (request.getGroupName() == null || request.getGroupName().isBlank())) {
            return Mono.error(new IllegalArgumentException("groupName required when accessType is GROUP"));
        }

        // Prepare payload
        ObjectNode payload;
        try {
            payload = preparePayload(request);
        } catch (Exception e) {
            return Mono.error(e);
        }

        log.debug("PingOne provisioning payload: {}", payload.toPrettyString());

        // Always fetch a fresh token, then provision
        return tokenService.getAccessToken()
                .flatMap(token -> provisioningService.provisionApplication(token, payload));
    }

    private ObjectNode preparePayload(OnboardingRequestDTO request) {
        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("name", request.getApplicationName());
        payload.put("enabled", true);

        String protocol = request.getProtocol() == null ? "OIDC" : request.getProtocol().toUpperCase();

        if (protocol.equals("SAML")) {
            /*
             * PingOne SAML Application payload:
             * {
             * "name": "...",
             * "enabled": true,
             * "protocol": "SAML",
             * "type": "WEB_APP",
             * "spEntityId": "urn:example:app", ← required
             * "acsUrls": ["https://app/saml/acs"], ← required, array
             * "assertionDuration": 60, ← seconds
             * "sloBinding": "HTTP_REDIRECT",
             * "responseSigned": false,
             * "assertionSigned": true
             * }
             */
            payload.put("protocol", "SAML");
            payload.put("type", "WEB_APP");

            if (request.getEntityId() == null || request.getEntityId().isBlank()) {
                throw new IllegalArgumentException("Entity ID (spEntityId) is required for SAML applications");
            }
            if (request.getAcsUrl() == null || request.getAcsUrl().isBlank()) {
                throw new IllegalArgumentException("ACS URL is required for SAML applications");
            }

            // spEntityId is the SP's unique identifier (audience)
            payload.put("spEntityId", request.getEntityId());

            // acsUrls must be an array
            payload.putArray("acsUrls").add(request.getAcsUrl());

            // Sensible SAML defaults
            payload.put("assertionDuration", 60);
            payload.put("assertionSigned", true);
            payload.put("responseSigned", false);
            payload.put("sloBinding", "HTTP_REDIRECT");

            if (request.getNameIdFormat() != null && !request.getNameIdFormat().isBlank()) {
                payload.put("subjectNameIdFormat", request.getNameIdFormat());
            }

        } else {
            /*
             * PingOne OIDC Application payload:
             * {
             * "name": "...",
             * "enabled": true,
             * "protocol": "OPENID_CONNECT",
             * "type": "WEB_APP",
             * "grantTypes": ["AUTHORIZATION_CODE"],
             * "redirectUris": ["https://app/callback"],
             * "postLogoutRedirectUris": ["https://app/logout"],
             * "scopes": ["openid","profile","email"]
             * }
             * Note: PingOne expects UPPERCASE grant type strings.
             */
            payload.put("protocol", "OPENID_CONNECT");
            payload.put("type", "WEB_APP");

            if (request.getGrantTypes() != null && !request.getGrantTypes().isBlank()) {
                var grantNode = payload.putArray("grantTypes");
                var responseNode = payload.putArray("responseTypes");
                for (String g : request.getGrantTypes().split("[,\\s]+")) {
                    if (!g.isBlank()) {
                        String normalized = g.trim().toUpperCase();
                        grantNode.add(normalized);
                        if ("AUTHORIZATION_CODE".equals(normalized)) {
                            responseNode.add("CODE");
                        } else if ("IMPLICIT".equals(normalized)) {
                            responseNode.add("TOKEN");
                            responseNode.add("ID_TOKEN");
                        }
                    }
                }
            } else {
                payload.putArray("grantTypes").add("AUTHORIZATION_CODE");
                payload.putArray("responseTypes").add("CODE");
            }

            if (request.getRedirectUri() != null && !request.getRedirectUri().isBlank()) {
                var redirectNode = payload.putArray("redirectUris");
                for (String r : request.getRedirectUri().split("[,\\s]+")) {
                    if (!r.isBlank())
                        redirectNode.add(r.trim());
                }
            }

            if (request.getPostLogoutRedirectUri() != null && !request.getPostLogoutRedirectUri().isBlank()) {
                payload.putArray("postLogoutRedirectUris").add(request.getPostLogoutRedirectUri());
            }

            if (request.getScopes() != null && !request.getScopes().isBlank()) {
                var scopeNode = payload.putArray("scopes");
                for (String s : request.getScopes().split("[,\\s]+")) {
                    if (!s.isBlank())
                        scopeNode.add(s.trim());
                }
            }

            if (request.getClientId() != null && !request.getClientId().isBlank()) {
                payload.put("clientId", request.getClientId());
            }
        }

        // Access control block
        ObjectNode accessControl = objectMapper.createObjectNode();
        accessControl.put("type", request.getAccessType() != null ? request.getAccessType() : "ALL_USERS");
        if ("GROUP".equals(request.getAccessType())) {
            accessControl.put("groupName", request.getGroupName());
        }
        payload.set("accessControl", accessControl);

        return payload;
    }
}
