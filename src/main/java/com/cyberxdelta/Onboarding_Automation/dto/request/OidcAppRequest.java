package com.cyberxdelta.Onboarding_Automation.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OidcAppRequest {

    @NotBlank(message = "Application name is required")
    private String appName;

    @NotBlank(message = "Redirect URIs are required")
    private String redirectUris;

    @NotBlank(message = "Grant types are required")
    private String grantTypes;

    private String idpType = "PingOne";

    @NotBlank(message = "Assignment is required")
    private String assignment;

    private String groupId;
}