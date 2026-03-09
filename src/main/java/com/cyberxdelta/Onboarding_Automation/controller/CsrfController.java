package com.cyberxdelta.Onboarding_Automation.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
public class CsrfController {

    @GetMapping("/csrf")
    public ResponseEntity<Map<String, String>> csrf(CsrfToken token) {
        Map<String, String> response = new HashMap<>();
        response.put("token", token.getToken());
        response.put("header", token.getHeaderName());
        response.put("parameterName", token.getParameterName());
        return ResponseEntity.ok(response);
    }
}
