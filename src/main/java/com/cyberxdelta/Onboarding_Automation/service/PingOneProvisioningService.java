package com.cyberxdelta.Onboarding_Automation.service;

import com.cyberxdelta.Onboarding_Automation.config.PingOneConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

@Slf4j
@Service
public class PingOneProvisioningService {

    @Autowired
    private PingOneConfig config;

    @Autowired
    private WebClient pingOneWebClient;



    public Mono<JsonNode> provisionApplication(String accessToken, ObjectNode payload) {
        log.info("Provisioning application | App: {} | Env: {}",
                payload.get("name").asText(), config.getEnvironmentId());

        String uri = String.format("/environments/%s/applications", config.getEnvironmentId());

        return pingOneWebClient.post()
                .uri(uri)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .onStatus(status -> status.is5xxServerError(), response -> {
                    log.warn("Received 5xx error from PingOne API: {}", response.statusCode());
                    return Mono.error(new RuntimeException("PingOne Server Error"));
                })
                .onStatus(status -> status.is4xxClientError(), response ->
                        response.bodyToMono(String.class).flatMap(body -> {
                            log.error("PingOne Client Error: {} | Body: {}", response.statusCode(), body);
                            return Mono.error(new com.cyberxdelta.Onboarding_Automation.exception.PingOneApiException(
                                    "PingOne rejected the request (" + response.statusCode() + "): " + body));
                        }))
                .bodyToMono(JsonNode.class)
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(2))
                        .filter(throwable -> {
                            // Only retry on network errors or specifically marked 5xx internal server
                            // errors
                            return throwable instanceof java.io.IOException ||
                                    (throwable instanceof RuntimeException
                                            && "PingOne Server Error".equals(throwable.getMessage()));
                        })
                        .doBeforeRetry(retrySignal -> log.info("Retrying PingOne API call... attempt {}",
                                retrySignal.totalRetries() + 1)))
                .doOnSuccess(response -> log.info("Successfully provisioned application: {}",
                        response.has("id") ? response.get("id").asText() : "Unknown ID"))
                .doOnError(error -> log.error("Final error provisioning application: {}", error.getMessage()));
    }
}
