package com.cyberxdelta.Onboarding_Automation.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String applicationName;

    @Column(nullable = false)
    private String protocol;

    @Column(nullable = false)
    private String identityProvider;

    @Column(nullable = false)
    private String redirectUri;

    @Column(nullable = false)
    private String accessType;

    private String groupName;

    @Column(nullable = false)
    private String username; // The operator who provisioned the asset

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

    private LocalDateTime provisionedAt;

    @PrePersist
    protected void onCreate() {
        provisionedAt = LocalDateTime.now();
    }
}
