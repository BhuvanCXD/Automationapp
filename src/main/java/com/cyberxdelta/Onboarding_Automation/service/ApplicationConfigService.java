package com.cyberxdelta.Onboarding_Automation.service;

import com.cyberxdelta.Onboarding_Automation.dto.ApplicationConfigDto;
import com.cyberxdelta.Onboarding_Automation.entity.ApplicationConfig;
import com.cyberxdelta.Onboarding_Automation.repository.ApplicationConfigRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationConfigService {

    private final ApplicationConfigRepository repository;

    public ApplicationConfigService(ApplicationConfigRepository repository) {
        this.repository = repository;
    }

    public List<ApplicationConfigDto> listForUser(String username) {
        return repository.findByOwnerUsername(username).stream().map(this::toDto).collect(Collectors.toList());
    }

    public ApplicationConfigDto getById(Long id) {
        return repository.findById(id).map(this::toDto).orElse(null);
    }

    public ApplicationConfigDto create(String ownerUsername, ApplicationConfigDto dto) {
        ApplicationConfig entity = new ApplicationConfig();
        entity.setName(dto.getName());
        entity.setType(dto.getType());
        entity.setConfigJson(dto.getConfigJson());
        entity.setOwnerUsername(ownerUsername);
        ApplicationConfig saved = repository.save(entity);
        return toDto(saved);
    }

    public ApplicationConfigDto update(String ownerUsername, Long id, ApplicationConfigDto dto) {
        return repository.findById(id).map(entity -> {
            if (!ownerUsername.equals(entity.getOwnerUsername())) return null;
            entity.setName(dto.getName());
            entity.setType(dto.getType());
            entity.setConfigJson(dto.getConfigJson());
            ApplicationConfig saved = repository.save(entity);
            return toDto(saved);
        }).orElse(null);
    }

    public boolean delete(String ownerUsername, Long id) {
        return repository.findById(id).map(entity -> {
            if (!ownerUsername.equals(entity.getOwnerUsername())) return false;
            repository.delete(entity);
            return true;
        }).orElse(false);
    }

    private ApplicationConfigDto toDto(ApplicationConfig e) {
        ApplicationConfigDto d = new ApplicationConfigDto();
        d.setId(e.getId());
        d.setName(e.getName());
        d.setType(e.getType());
        d.setConfigJson(e.getConfigJson());
        return d;
    }
}
