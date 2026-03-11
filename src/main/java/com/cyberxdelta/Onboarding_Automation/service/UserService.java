package com.cyberxdelta.Onboarding_Automation.service;

import com.cyberxdelta.Onboarding_Automation.dto.request.RegisterRequest;
import com.cyberxdelta.Onboarding_Automation.exception.PingOneApiException;
import com.cyberxdelta.Onboarding_Automation.entity.User;
import com.cyberxdelta.Onboarding_Automation.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(RegisterRequest request) {
        log.info("Registering new user: {}", request.getUsername());

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new PingOneApiException("Username already exists");
        }

        // Check if email already exists
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new PingOneApiException("Email address is already in use. Please use a different email.");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole("ROLE_USER");

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getUsername());

        return savedUser;
    }

    public User getProfile(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new PingOneApiException("User not found: " + username));
    }

    @Transactional
    public User updateProfile(String username, com.cyberxdelta.Onboarding_Automation.dto.UserDto dto) {
        log.info("Updating profile for user: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new PingOneApiException("User not found"));

        if (dto.getEmail() != null)
            user.setEmail(dto.getEmail());
        if (dto.getFirstName() != null)
            user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null)
            user.setLastName(dto.getLastName());

        return userRepository.save(user);
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
