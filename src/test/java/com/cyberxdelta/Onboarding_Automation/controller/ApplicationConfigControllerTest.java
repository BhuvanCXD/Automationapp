package com.cyberxdelta.Onboarding_Automation.controller;

import com.cyberxdelta.Onboarding_Automation.dto.ApplicationConfigDto;
import com.cyberxdelta.Onboarding_Automation.service.ApplicationConfigService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
public class ApplicationConfigControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationConfigService appService;

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void listApplications_authorized() throws Exception {
        List<ApplicationConfigDto> apps = new ArrayList<>();
        ApplicationConfigDto app = new ApplicationConfigDto();
        app.setId(1L);
        app.setName("TestApp");
        app.setType("saml");
        apps.add(app);

        Mockito.when(appService.listForUser("testuser")).thenReturn(apps);

        mockMvc.perform(get("/api/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("TestApp"));
    }

    @Test
    public void listApplications_unauthenticated_denied() throws Exception {
        mockMvc.perform(get("/api/applications"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void createApplication_success() throws Exception {
        ApplicationConfigDto dto = new ApplicationConfigDto();
        dto.setName("NewApp");
        dto.setType("oauth");
        dto.setConfigJson("{}");

        ApplicationConfigDto created = new ApplicationConfigDto();
        created.setId(1L);
        created.setName("NewApp");
        created.setType("oauth");

        Mockito.when(appService.create("testuser", dto)).thenReturn(created);

        mockMvc.perform(post("/api/applications")
                .contentType("application/json")
                .content("{\"name\": \"NewApp\", \"type\": \"oauth\", \"configJson\": \"{}\"}")
                .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isOk());
    }
}
