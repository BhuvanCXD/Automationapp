package com.cyberxdelta.Onboarding_Automation.service;

import com.cyberxdelta.Onboarding_Automation.dto.request.RegisterRequest;
import com.cyberxdelta.Onboarding_Automation.entity.User;
import com.cyberxdelta.Onboarding_Automation.exception.PingOneApiException;
import com.cyberxdelta.Onboarding_Automation.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockBean
    private UserRepository userRepository;

    @Test
    public void registerUser_success() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("foo");
        request.setPassword("secret");
        request.setEmail("foo@example.com");
        request.setFirstName("Foo");
        request.setLastName("Bar");

        Mockito.when(userRepository.existsByUsername("foo")).thenReturn(false);
        Mockito.when(userRepository.save(Mockito.any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User u = userService.registerUser(request);
        assertThat(u.getUsername()).isEqualTo("foo");
        assertThat(passwordEncoder.matches("secret", u.getPassword())).isTrue();
        assertThat(u.getRole()).isEqualTo("ROLE_USER");
    }

    @Test
    public void registerUser_duplicateUsername_throws() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("foo");
        request.setPassword("secret");
        request.setEmail("foo@example.com");

        Mockito.when(userRepository.existsByUsername("foo")).thenReturn(true);

        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(PingOneApiException.class)
                .hasMessageContaining("Username already exists");
    }
}