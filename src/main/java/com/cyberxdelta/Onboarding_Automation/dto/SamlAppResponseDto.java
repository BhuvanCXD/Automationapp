package com.cyberxdelta.Onboarding_Automation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SamlAppResponseDto {
    private String appId;
    private String appName;
    private String samlMetadataUrl;
    private String assertionConsumerServiceUrl;
    private String entityId;
    private String details;
    private String signOnUrl; // Add signOnUrl field
    private String applicationId;
    private String samlMetadata;
    private String idpConfiguration;
}
