package com.cyberxdelta.Onboarding_Automation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public WebClient pingOneWebClient(WebClient.Builder builder, PingOneConfig config) {
        return builder
                .baseUrl(config.getBaseUrl())
                .filter((request, next) -> {
                    String correlationId = org.slf4j.MDC.get("correlationId");
                    if (correlationId != null) {
                        return next
                                .exchange(org.springframework.web.reactive.function.client.ClientRequest.from(request)
                                        .header("X-Correlation-Id", correlationId)
                                        .build());
                    }
                    return next.exchange(request);
                })
                .build();
    }
}
