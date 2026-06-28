package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.RequirementService
import br.com.suzanoit.qa.core.domain.Requirement
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/requirements")
@CrossOrigin(origins = ["*"])
class RequirementController(private val requirementService: RequirementService) {

    @GetMapping
    fun getAllRequirements(): List<Requirement> = requirementService.getAllRequirements()

    @GetMapping("/{id}")
    fun getRequirement(@PathVariable id: String): ResponseEntity<Requirement> {
        val requirement = requirementService.getRequirement(id)
        return if (requirement != null) ResponseEntity.ok(requirement) else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createRequirement(@RequestBody requirement: Requirement): Requirement = requirementService.createRequirement(requirement)

    @DeleteMapping("/{id}")
    fun deleteRequirement(@PathVariable id: String): ResponseEntity<Void> {
        requirementService.deleteRequirement(id)
        return ResponseEntity.noContent().build()
    }
}
