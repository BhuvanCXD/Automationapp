package com.cyberxdelta.Onboarding_Automation.service;

import com.cyberxdelta.Onboarding_Automation.config.PingOneConfig;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Fetches a fresh OAuth2 client_credentials access token from PingOne on every invocation.
 *
 * A separate WebClient is built without a base URL because the token endpoint is on
 * auth.pingone.com while the management API is on api.pingone.com — two different hosts.
 * Using the shared pingOneWebClient (which has api.pingone.com as base URL) would resolve
 * the absolute token URL incorrectly.
 */
@Slf4j
@Service
public class PingOneTokenService {

    @Autowired
    private PingOneConfig config;

    /**
     * Always fetches a fresh access token from PingOne.
     * No caching is used — PingOne issues short-lived tokens and each application
     * provisioning request should use a brand-new token to avoid stale token issues.
     */
    public Mono<String> getAccessToken() {
        return fetchFreshToken();
    }

    private Mono<String> fetchFreshToken() {
        log.info("Fetching fresh access token from PingOne: {}", config.getAuthUrl());

        // Build a standalone WebClient with NO base URL so the absolute token URL
        // (auth.pingone.com) is not overridden by the api.pingone.com base URL.
        WebClient tokenClient = WebClient.builder().build();

        return tokenClient.post()
                .uri(config.getAuthUrl())
                .headers(headers -> headers.setBasicAuth(config.getClientId(), config.getClientSecret()))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "client_credentials")
                        .with("scope", "openid"))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response ->
                        response.bodyToMono(String.class).flatMap(body -> {
                            log.error("PingOne token 4xx error: {} | body: {}", response.statusCode(), body);
                            return Mono.error(new RuntimeException(
                                    "Failed to obtain PingOne token: " + response.statusCode() + " — " + body));
                        }))
                .onStatus(status -> status.is5xxServerError(), response ->
                        response.bodyToMono(String.class).flatMap(body -> {
                            log.error("PingOne token 5xx error: {} | body: {}", response.statusCode(), body);
                            return Mono.error(new RuntimeException("PingOne token server error: " + response.statusCode()));
                        }))
                .bodyToMono(JsonNode.class)
                .map(json -> {
                    String token = json.get("access_token").asText();
                    int expiresIn = json.has("expires_in") ? json.get("expires_in").asInt() : -1;
                    log.info("Successfully obtained fresh PingOne access token. Expires in {} seconds.", expiresIn);
                    return token;
                })
                .doOnError(error -> log.error("Error fetching PingOne access token: {}", error.getMessage()));
    }
}
