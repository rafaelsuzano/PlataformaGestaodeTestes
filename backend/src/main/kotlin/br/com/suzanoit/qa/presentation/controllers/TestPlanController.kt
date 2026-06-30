package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.CreateTestPlanRequest
import br.com.suzanoit.qa.application.usecases.TestPlanService
import br.com.suzanoit.qa.core.domain.TestPlan
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/test-plans")
@CrossOrigin(origins = ["*"])
class TestPlanController(private val service: TestPlanService) {

    @PostMapping
    fun create(@RequestBody request: CreateTestPlanRequest): ResponseEntity<TestPlan> {
        return ResponseEntity.ok(service.createTestPlan(request))
    }

    @GetMapping("/project/{projectId}")
    fun getByProject(@PathVariable projectId: String): ResponseEntity<List<TestPlan>> {
        return ResponseEntity.ok(service.getTestPlansByProject(projectId))
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: String): ResponseEntity<TestPlan> {
        val plan = service.getTestPlan(id)
        return if (plan != null) ResponseEntity.ok(plan) else ResponseEntity.notFound().build()
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody plan: TestPlan): ResponseEntity<TestPlan> {
        return ResponseEntity.ok(service.updateTestPlan(plan.copy(id = id)))
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String): ResponseEntity<Void> {
        service.deleteTestPlan(id)
        return ResponseEntity.noContent().build()
    }
}
