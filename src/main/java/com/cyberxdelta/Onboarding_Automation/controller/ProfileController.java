package com.cyberxdelta.Onboarding_Automation.controller;

import com.cyberxdelta.Onboarding_Automation.entity.User;
import com.cyberxdelta.Onboarding_Automation.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        log.info("Fetching profile for user: {}", username);

        try {
            User user = userService.getProfile(username);
            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("createdAt", user.getCreatedAt());

            // UI Specific placeholders for Remix components
            response.put("accessLevel",
                    user.getRole().equals("ROLE_ADMIN") ? "Super Administrator" : "Security Operator");
            response.put("status", "Tactical-Active");
            response.put("mfaEnabled", true);
            // Adding securityStatus as per instruction for UI completeness
            response.put("securityStatus", "Active"); // Placeholder for security status

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to fetch profile", e);
            return ResponseEntity.status(500).body(Map.of("status", "error", "message", "Identity sync failure"));
        }
    }
}
