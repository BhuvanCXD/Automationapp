package com.cyberxdelta.Onboarding_Automation.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SamlAppRequest {

    @NotBlank(message = "Application name is required")
    private String appName;

    @NotBlank(message = "Entity ID is required")
    private String entityId;

    @NotBlank(message = "ACS URL is required")
    private String acsUrl;

    private String sloEndpoint;

    private String idpType = "PingOne";

    @NotBlank(message = "Assignment is required")
    private String assignment; // ALL_USERS or SPECIFIC_GROUP

    private String groupId;
}