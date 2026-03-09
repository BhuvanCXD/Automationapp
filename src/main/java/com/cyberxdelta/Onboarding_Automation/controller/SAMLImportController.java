package com.cyberxdelta.Onboarding_Automation.controller;

import lombok.extern.slf4j.Slf4j;

import com.cyberxdelta.Onboarding_Automation.dto.ApplicationConfigDto;
import com.cyberxdelta.Onboarding_Automation.dto.SAMLMetadataDto;
import com.cyberxdelta.Onboarding_Automation.service.ApplicationConfigService;
import com.cyberxdelta.Onboarding_Automation.service.SAMLMetadataService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/saml")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('USER')")
public class SAMLImportController {

    private final SAMLMetadataService samlService;
    private final ApplicationConfigService appService;
    private final ObjectMapper mapper = new ObjectMapper();

    public SAMLImportController(SAMLMetadataService samlService, ApplicationConfigService appService) {
        this.samlService = samlService;
        this.appService = appService;
    }

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> importMetadata(@AuthenticationPrincipal UserDetails user,
                                            @RequestParam(required = false) String name,
                                            @RequestParam("file") MultipartFile file) {
        try {
            String xml = new String(file.getBytes(), java.nio.charset.StandardCharsets.UTF_8);
            SAMLMetadataDto meta;
            try {
                meta = samlService.parseAndValidate(xml);
            } catch (Exception parseEx) {
                // log and return detailed parse error
                log.error("Error parsing SAML metadata", parseEx);
                return ResponseEntity.badRequest().body(java.util.Map.of(
                        "error", "Invalid metadata: " + parseEx.getMessage(),
                        "stack", parseEx.toString()));
            }

            ApplicationConfigDto dto = new ApplicationConfigDto();
            dto.setName(name != null && !name.isBlank() ? name : meta.getEntityId());
            dto.setType("saml");
            dto.setConfigJson(mapper.writeValueAsString(meta));

            ApplicationConfigDto created = appService.create(user.getUsername(), dto);

            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", iae.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during SAML import", e);
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to import metadata", "detail", e.toString()));
        }
    }
}
