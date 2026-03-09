package com.cyberxdelta.Onboarding_Automation.controller;

import com.cyberxdelta.Onboarding_Automation.dto.UserDto;
import com.cyberxdelta.Onboarding_Automation.entity.User;
import com.cyberxdelta.Onboarding_Automation.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        result.put("username", authentication.getName());
        List<String> roles = authentication.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toList());
        result.put("roles", roles);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> allUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDto> dtos = users.stream().map(this::toDto).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @org.springframework.web.bind.annotation.PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(
            @org.springframework.web.bind.annotation.RequestBody com.cyberxdelta.Onboarding_Automation.dto.UserDto dto,
            Authentication authentication) {
        if (authentication == null)
            return ResponseEntity.status(401).build();
        User updated = userService.updateProfile(authentication.getName(), dto);
        return ResponseEntity.ok(toDto(updated));
    }

    private UserDto toDto(User u) {
        UserDto dto = new UserDto();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setEmail(u.getEmail());
        dto.setFirstName(u.getFirstName());
        dto.setLastName(u.getLastName());
        dto.setRole(u.getRole());
        return dto;
    }
}
