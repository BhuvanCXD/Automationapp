package com.cyberxdelta.Onboarding_Automation.service;

import com.cyberxdelta.Onboarding_Automation.dto.OnboardingRequestDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
public class OnboardingOrchestrationServiceTest {

    @Autowired
    private OnboardingOrchestrationService orchestrationService;

    @MockBean
    private PingOneTokenService tokenService;

    @MockBean
    private PingOneProvisioningService provisioningService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testOnboardApplication_Success() {
        OnboardingRequestDTO request = new OnboardingRequestDTO();
        request.setApplicationName("TestApp");
        request.setProtocol("SAML");
        request.setAccessType("ALL_USERS");

        when(tokenService.getAccessToken()).thenReturn(Mono.just("mock-token"));

        JsonNode mockResponse = objectMapper.createObjectNode().put("id", "provisioned-id");
        when(provisioningService.provisionApplication(eq("mock-token"), any())).thenReturn(Mono.just(mockResponse));

        StepVerifier.create(orchestrationService.onboardApplication(request))
                .expectNext(mockResponse)
                .verifyComplete();
    }

    @Test
    void testOnboardApplication_ValidationError() {
        OnboardingRequestDTO request = new OnboardingRequestDTO();
        request.setApplicationName("TestApp");
        request.setAccessType("GROUP");
        request.setGroupName(""); // Missing group name for GROUP access type

        StepVerifier.create(orchestrationService.onboardApplication(request))
                .expectErrorMatches(throwable -> throwable instanceof IllegalArgumentException
                        && throwable.getMessage().contains("groupName must be present"))
                .verify();
    }
}
