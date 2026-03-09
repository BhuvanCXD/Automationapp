package com.cyberxdelta.Onboarding_Automation.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "pingone")
@Data
public class PingOneConfig {
    private String baseUrl;
    private String tokenUrl;
    private String clientId;
    private String clientSecret;
    private String environmentId;
    private String authUrl;
    private String apiUrl;
}