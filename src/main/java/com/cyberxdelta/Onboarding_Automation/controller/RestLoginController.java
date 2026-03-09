package com.cyberxdelta.Onboarding_Automation.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
public class RestLoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody com.cyberxdelta.Onboarding_Automation.dto.request.LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response) {

        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        log.info("REST request to login user: {}", username);

        try {
            // Authenticate the user
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, password);
            Authentication auth = authenticationManager.authenticate(authToken);

            // Invalidate old session to prevent session fixation
            HttpSession oldSession = request.getSession(false);
            if (oldSession != null) {
                oldSession.invalidate();
            }

            // Set auth in SecurityContext
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);

            // Persist the SecurityContext to the new HTTP session so subsequent requests are authenticated
            HttpSession newSession = request.getSession(true);
            newSession.setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

            // Build success response
            Map<String, String> resp = new HashMap<>();
            resp.put("status", "success");
            resp.put("username", username);
            String roles = auth.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .reduce((a, b) -> a + "," + b).orElse("");
            resp.put("roles", roles);
            resp.put("message", "Login successful");
            return ResponseEntity.ok(resp);

        } catch (AuthenticationException e) {
            log.error("Authentication failed for user: {}", username);
            Map<String, String> resp = new HashMap<>();
            resp.put("status", "error");
            resp.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(resp);
        } catch (Exception e) {
            log.error("Login error", e);
            Map<String, String> resp = new HashMap<>();
            resp.put("status", "error");
            resp.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(500).body(resp);
        }
    }
}
