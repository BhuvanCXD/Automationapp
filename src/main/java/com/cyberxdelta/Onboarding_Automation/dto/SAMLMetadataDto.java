package com.cyberxdelta.Onboarding_Automation.dto;

import java.util.ArrayList;
import java.util.List;

public class SAMLMetadataDto {
    private String entityId;
    private String singleSignOnService;
    private List<SAMLCertificateDto> certificates = new ArrayList<>();
    private boolean signaturePresent;
    private Boolean signatureValid; // null = unchecked/unknown
    private String signatureError;

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getSingleSignOnService() {
        return singleSignOnService;
    }

    public void setSingleSignOnService(String singleSignOnService) {
        this.singleSignOnService = singleSignOnService;
    }

    public List<SAMLCertificateDto> getCertificates() {
        return certificates;
    }

    public void setCertificates(List<SAMLCertificateDto> certificates) {
        this.certificates = certificates;
    }

    public static class SAMLCertificateDto {
        private String subject;
        private String issuer;
        private String notBefore;
        private String notAfter;
        private String rawBase64;

        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getIssuer() { return issuer; }
        public void setIssuer(String issuer) { this.issuer = issuer; }
        public String getNotBefore() { return notBefore; }
        public void setNotBefore(String notBefore) { this.notBefore = notBefore; }
        public String getNotAfter() { return notAfter; }
        public void setNotAfter(String notAfter) { this.notAfter = notAfter; }
        public String getRawBase64() { return rawBase64; }
        public void setRawBase64(String rawBase64) { this.rawBase64 = rawBase64; }
    }

    public boolean isSignaturePresent() {
        return signaturePresent;
    }

    public void setSignaturePresent(boolean signaturePresent) {
        this.signaturePresent = signaturePresent;
    }

    public Boolean getSignatureValid() {
        return signatureValid;
    }

    public void setSignatureValid(Boolean signatureValid) {
        this.signatureValid = signatureValid;
    }

    public String getSignatureError() {
        return signatureError;
    }

    public void setSignatureError(String signatureError) {
        this.signatureError = signatureError;
    }
}
