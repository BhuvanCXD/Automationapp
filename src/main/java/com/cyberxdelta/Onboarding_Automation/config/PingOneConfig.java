package com.cyberxdelta.Onboarding_Automation.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "pingone")
@Data
public class PingOneConfig {

    // Flat properties (e.g. pingone.client-id)
    private String clientId;
    private String clientSecret;
    private String authUrl;
    private String environmentId;
    
    // Fallbacks just in case
    private String baseUrl;
    private String tokenUrl;
    private String apiUrl;

    // Nested 'api' properties (e.g. pingone.api.base-url)
    private Api api = new Api();

    @Data
    public static class Api {
        private String baseUrl;
        private String tokenUrl;
        private String clientId;
        private String clientSecret;
        private String environmentId;
    }

    // Helper getters to seamlessly return the correct non-null property
    public String getBaseUrl() {
        return (api.getBaseUrl() != null) ? api.getBaseUrl() : baseUrl;
    }
    
    public String getEnvironmentId() {
        return (api.getEnvironmentId() != null) ? api.getEnvironmentId() : environmentId;
    }
    
    public String getClientId() {
        return (clientId != null) ? clientId : api.getClientId();
    }
    
    public String getClientSecret() {
        return (clientSecret != null) ? clientSecret : api.getClientSecret();
    }
}