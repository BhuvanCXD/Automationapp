package com.cyberxdelta.Onboarding_Automation.dto;

import java.util.List;

/**
 * SAML Application Request DTO
 * Maps to PingOne SAML application creation API
 *
 * Correct PingOne API format (top-level fields):
 * {
 *   "enabled": true,
 *   "name": "SAML_Rahul_APP",
 *   "description": "SAML application created via API",
 *   "type": "WEB_APP",
 *   "protocol": "SAML",
 *   "spEntityId": "https://example.com/sp_rahul",
 *   "acsUrls": ["https://example.com/acs"],
 *   "assertionDuration": 300,
 *   "subjectNameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
 *   "signOnUrl": "https://example.com/login"
 * }
 */
public class SamlAppRequestDto {
    private String name;
    private boolean enabled;
    private String protocol;          // Must be "SAML" (uppercase)
    private String description;
    private String type;              // Must be "WEB_APP" for SAML

    // PingOne SAML-specific fields (top-level, not wrapped in saml object)
    private String spEntityId;
    private List<String> acsUrls;
    private String subjectNameIdFormat;
    private int assertionDuration;
    private String signOnUrl;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) {
        // Ensure protocol is uppercase for PingOne
        this.protocol = protocol != null ? protocol.toUpperCase() : "SAML";
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSpEntityId() { return spEntityId; }
    public void setSpEntityId(String spEntityId) { this.spEntityId = spEntityId; }

    public List<String> getAcsUrls() { return acsUrls; }
    public void setAcsUrls(List<String> acsUrls) { this.acsUrls = acsUrls; }

    public String getSubjectNameIdFormat() { return subjectNameIdFormat; }
    public void setSubjectNameIdFormat(String subjectNameIdFormat) {
        // Convert user-friendly names to PingOne URN format
        if (subjectNameIdFormat == null) {
            this.subjectNameIdFormat = "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress";
        } else if (subjectNameIdFormat.equals("email")) {
            this.subjectNameIdFormat = "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress";
        } else if (subjectNameIdFormat.equals("persistent")) {
            this.subjectNameIdFormat = "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent";
        } else if (subjectNameIdFormat.equals("transient")) {
            this.subjectNameIdFormat = "urn:oasis:names:tc:SAML:2.0:nameid-format:transient";
        } else if (subjectNameIdFormat.equals("unspecified")) {
            this.subjectNameIdFormat = "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified";
        } else {
            // Assume it's already in URN format
            this.subjectNameIdFormat = subjectNameIdFormat;
        }
    }

    public int getAssertionDuration() { return assertionDuration; }
    public void setAssertionDuration(int assertionDuration) {
        this.assertionDuration = assertionDuration > 0 ? assertionDuration : 3600;
    }

    public String getSignOnUrl() { return signOnUrl; }
    public void setSignOnUrl(String signOnUrl) { this.signOnUrl = signOnUrl; }

    // Backward compatibility getters/setters for old field names
    @Deprecated
    public List<String> getAssertionConsumerServiceUrls() {
        return acsUrls;
    }
    @Deprecated
    public void setAssertionConsumerServiceUrls(List<String> assertionConsumerServiceUrls) {
        this.acsUrls = assertionConsumerServiceUrls;
    }

    @Deprecated
    public String getEntityId() {
        return spEntityId;
    }
    @Deprecated
    public void setEntityId(String entityId) {
        this.spEntityId = entityId;
    }

    @Deprecated
    public String getNameIdFormat() {
        return subjectNameIdFormat;
    }
    @Deprecated
    public void setNameIdFormat(String nameIdFormat) {
        setSubjectNameIdFormat(nameIdFormat);
    }
}
