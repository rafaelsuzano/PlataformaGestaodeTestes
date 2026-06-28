package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.TestCaseService
import br.com.suzanoit.qa.core.domain.TestCase
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/test-cases")
@CrossOrigin(origins = ["*"])
class TestCaseController(private val testCaseService: TestCaseService) {

    @GetMapping
    fun getAllTestCases(): List<TestCase> = testCaseService.getAllTestCases()

    @GetMapping("/{id}")
    fun getTestCase(@PathVariable id: String): ResponseEntity<TestCase> {
        val testCase = testCaseService.getTestCase(id)
        return if (testCase != null) ResponseEntity.ok(testCase) else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createTestCase(@RequestBody testCase: TestCase): TestCase = testCaseService.createTestCase(testCase)

    @PutMapping("/{id}")
    fun updateTestCase(@PathVariable id: String, @RequestBody testCase: TestCase): ResponseEntity<TestCase> {
        val updated = testCaseService.updateTestCase(id, testCase)
        return if (updated != null) ResponseEntity.ok(updated) else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun deleteTestCase(@PathVariable id: String): ResponseEntity<Void> {
        testCaseService.deleteTestCase(id)
        return ResponseEntity.noContent().build()
    }
}
