package com.cyberxdelta.Onboarding_Automation.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProfileResponse {
    private String username;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private String status;
}
