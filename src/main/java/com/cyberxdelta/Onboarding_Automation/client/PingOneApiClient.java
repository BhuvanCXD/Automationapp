package com.cyberxdelta.Onboarding_Automation.client;

import com.cyberxdelta.Onboarding_Automation.config.PingOneConfig;
import com.cyberxdelta.Onboarding_Automation.dto.SamlAppRequestDto;
import com.cyberxdelta.Onboarding_Automation.dto.SamlAppResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class PingOneApiClient {
    private static final Logger logger = LoggerFactory.getLogger(PingOneApiClient.class);

    private final WebClient webClient;
    private final PingOneConfig config;

    public PingOneApiClient(WebClient.Builder webClientBuilder, @Autowired PingOneConfig config) {
        this.webClient = webClientBuilder.build();
        this.config = config;
        logger.info("PingOneApiClient initialized with apiUrl: {}", config.getApiUrl());
    }

    public Mono<SamlAppResponseDto> createSamlApplication(String accessToken, SamlAppRequestDto requestDto) {
        logger.info("Creating SAML application in PingOne.");
        logger.info("Target API URL: {}", config.getApiUrl());
        logger.info("Request: name={}, protocol={}, type={}, spEntityId={}, acsUrls={}",
            requestDto.getName(), requestDto.getProtocol(), requestDto.getType(),
            requestDto.getSpEntityId(), requestDto.getAcsUrls());

        // Log SAML configuration
        logger.info("SAML Config: spEntityId={}, acsUrls={}, assertionDuration={}, subjectNameIdFormat={}",
            requestDto.getSpEntityId(),
            requestDto.getAcsUrls(),
            requestDto.getAssertionDuration(),
            requestDto.getSubjectNameIdFormat());

        // Log the complete request body
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String requestJson = mapper.writeValueAsString(requestDto);
            logger.info("Complete request JSON being sent to PingOne: {}", requestJson);
        } catch (Exception e) {
            logger.warn("Could not serialize request for logging: {}", e.getMessage());
        }

        return webClient.post()
                .uri(config.getApiUrl())
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .bodyValue(requestDto)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> {
                    logger.error("PingOne API returned error status: {} {}", response.statusCode(), ((HttpStatus) response.statusCode()).getReasonPhrase());
                    return response.bodyToMono(String.class).flatMap(body -> {
                        logger.error("PingOne error response body: {}", body);
                        return Mono.error(new RuntimeException("PingOne API error: " + response.statusCode() + " - " + body));
                    });
                })
                .bodyToMono(String.class)
                .doOnNext(response -> {
                    logger.info("PingOne API response received (length: {} bytes)", response.length());
                    logger.debug("PingOne API response: {}", response);
                })
                .map(response -> {
                    SamlAppResponseDto dto = new SamlAppResponseDto();
                    try {
                        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                        com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(response);

                        logger.info("Parsing PingOne response...");

                        if (root.has("id")) {
                            String appId = root.get("id").asText();
                            dto.setApplicationId(appId);
                            logger.info("Application created in PingOne with ID: {}", appId);
                        } else {
                            logger.warn("Response missing 'id' field");
                        }

                        if (root.has("metadata")) {
                            dto.setSamlMetadata(root.get("metadata").toString());
                            logger.info("SAML metadata extracted from response");
                        }

                        if (root.has("idpConfiguration")) {
                            dto.setIdpConfiguration(root.get("idpConfiguration").toString());
                            logger.info("IDP configuration extracted from response");
                        }

                        dto.setDetails(response);
                        logger.info("Successfully parsed PingOne response");
                    } catch (Exception e) {
                        logger.error("Failed to parse PingOne SAML response: {}", e.getMessage(), e);
                        dto.setDetails(response);
                    }
                    return dto;
                })
                .doOnError(error -> {
                    logger.error("Error in createSamlApplication: {}", error.getMessage(), error);
                });
    }
}
