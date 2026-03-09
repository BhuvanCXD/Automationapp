package com.cyberxdelta.Onboarding_Automation.controller;

import com.cyberxdelta.Onboarding_Automation.dto.request.RegisterRequest;
import com.cyberxdelta.Onboarding_Automation.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/register")
public class RestRegistrationController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("REST request to register user: {}", request.getUsername());
        try {
            // Validate username format
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Username is required");
                return ResponseEntity.status(400).body(response);
            }
            
            if (request.getUsername().length() < 3 || request.getUsername().length() > 20) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Username must be between 3 and 20 characters");
                return ResponseEntity.status(400).body(response);
            }

            // Validate password
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Password is required");
                return ResponseEntity.status(400).body(response);
            }
            
            if (request.getPassword().length() < 6) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Password must be at least 6 characters");
                return ResponseEntity.status(400).body(response);
            }

            // Validate email
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Email is required");
                return ResponseEntity.status(400).body(response);
            }

            // Call service to register
            userService.registerUser(request);
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Registration failed", e);
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage() != null ? e.getMessage() : "Registration failed");
            return ResponseEntity.status(400).body(response);
        }
    }
}

