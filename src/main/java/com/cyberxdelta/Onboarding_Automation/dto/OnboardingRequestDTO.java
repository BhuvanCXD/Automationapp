package com.cyberxdelta.Onboarding_Automation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OnboardingRequestDTO {

    @NotBlank(message = "Application name is mandatory")
    private String applicationName;

    @NotBlank(message = "Protocol is mandatory")
    @Pattern(regexp = "^(SAML|OIDC|OAuth2)$", message = "Protocol must be SAML, OIDC, or OAuth2")
    private String protocol;

    @NotBlank(message = "Identity provider is mandatory")
    private String identityProvider;

    private String redirectUri;

    @NotBlank(message = "Access type is mandatory")
    @Pattern(regexp = "^(ALL_USERS|GROUP)$", message = "Access type must be either ALL_USERS or GROUP")
    private String accessType;

    private String groupName;

    // Advanced Configuration
    private String clientId;
    private String clientSecret;
    private String scopes;
    private String grantTypes;
    private String postLogoutRedirectUri;
    private String entityId;
    private String acsUrl;
    private String nameIdFormat;
    private String attributeMapping;
    private String discoveryUrl;
}
