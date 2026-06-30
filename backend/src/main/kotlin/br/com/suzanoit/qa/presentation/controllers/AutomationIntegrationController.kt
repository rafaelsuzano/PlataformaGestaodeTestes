package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.AutomatedTestRunResponse
import br.com.suzanoit.qa.application.usecases.AutomationRunReportDto
import br.com.suzanoit.qa.application.usecases.AutomationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/integrations/automation")
@CrossOrigin(origins = ["*"])
class AutomationIntegrationController(private val automationService: AutomationService) {

    @PostMapping("/report")
    fun receiveReport(@RequestBody report: AutomationRunReportDto): ResponseEntity<AutomatedTestRunResponse> {
        val result = automationService.processReport(report)
        return ResponseEntity.ok(result)
    }

    @GetMapping("/runs/project/{projectId}")
    fun getRunsByProject(@PathVariable projectId: String): ResponseEntity<List<AutomatedTestRunResponse>> {
        val runs = automationService.getRunsByProject(projectId)
        return ResponseEntity.ok(runs)
    }
}
