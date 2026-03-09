package com.cyberxdelta.Onboarding_Automation.controller;

import com.cyberxdelta.Onboarding_Automation.dto.ApplicationConfigDto;
import com.cyberxdelta.Onboarding_Automation.service.ApplicationConfigService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('USER')")
public class ApplicationConfigController {

    private final ApplicationConfigService service;

    public ApplicationConfigController(ApplicationConfigService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ApplicationConfigDto>> list(@AuthenticationPrincipal UserDetails user) {
        List<ApplicationConfigDto> list = service.listForUser(user.getUsername());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<ApplicationConfigDto> create(@AuthenticationPrincipal UserDetails user, @RequestBody ApplicationConfigDto dto) {
        ApplicationConfigDto created = service.create(user.getUsername(), dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationConfigDto> get(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        ApplicationConfigDto dto = service.getById(id);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationConfigDto> update(@AuthenticationPrincipal UserDetails user, @PathVariable Long id, @RequestBody ApplicationConfigDto dto) {
        ApplicationConfigDto updated = service.update(user.getUsername(), id, dto);
        if (updated == null) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        boolean ok = service.delete(user.getUsername(), id);
        if (!ok) return ResponseEntity.status(403).build();
        return ResponseEntity.noContent().build();
    }
}
