package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.IntegrationService
import br.com.suzanoit.qa.core.domain.IntegrationConfig
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/integrations")
@CrossOrigin(origins = ["*"])
class IntegrationController(private val service: IntegrationService) {

    @GetMapping
    fun getAll(): ResponseEntity<List<IntegrationConfig>> {
        return ResponseEntity.ok(service.getAllConfigs())
    }

    @PostMapping
    fun save(@RequestBody config: IntegrationConfig): ResponseEntity<IntegrationConfig> {
        return ResponseEntity.ok(service.saveConfig(config))
    }
}
