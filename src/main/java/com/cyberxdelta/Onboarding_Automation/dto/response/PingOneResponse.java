package com.cyberxdelta.Onboarding_Automation.dto.response;

import lombok.Data;

@Data
public class PingOneResponse {
    private String id;
    private String clientId;
    private String clientSecret;
    private String status;
    private String message;
}