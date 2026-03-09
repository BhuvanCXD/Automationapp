package com.cyberxdelta.Onboarding_Automation.config;

import com.cyberxdelta.Onboarding_Automation.entity.User;
import com.cyberxdelta.Onboarding_Automation.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            final String adminName = "admin";
            if (!userRepository.existsByUsername(adminName)) {
                User admin = new User();
                admin.setUsername(adminName);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@example.com");
                admin.setFirstName("System");
                admin.setLastName("Administrator");
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
                System.out.println("[DataInitializer] Created default admin user: admin/admin123");
            }
        };
    }
}
