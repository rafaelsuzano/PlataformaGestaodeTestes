package br.com.suzanoit.qa.modules.integrations.presentation


import br.com.suzanoit.qa.modules.integrations.application.IntegrationService
import br.com.suzanoit.qa.modules.shared.domain.IntegrationConfig
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