package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.TestExecutionService
import br.com.suzanoit.qa.core.domain.TestExecution
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/test-executions")
@CrossOrigin(origins = ["*"])
class TestExecutionController(private val service: TestExecutionService) {

    @GetMapping
    fun getAll(): List<TestExecution> = service.getAllTestExecutions()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: String): ResponseEntity<TestExecution> {
        val execution = service.getTestExecution(id)
        return if (execution != null) ResponseEntity.ok(execution) else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun create(@RequestBody testExecution: TestExecution, @RequestHeader("X-User-Id", required = false) userId: String?): TestExecution = service.createTestExecution(testExecution, userId)

    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody testExecution: TestExecution, @RequestHeader("X-User-Id", required = false) userId: String?): ResponseEntity<TestExecution> {
        val updated = service.updateTestExecution(id, testExecution, userId)
        return if (updated != null) ResponseEntity.ok(updated) else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String, @RequestHeader("X-User-Id", required = false) userId: String?): ResponseEntity<Void> {
        service.deleteTestExecution(id, userId)
        return ResponseEntity.noContent().build()
    }
}
