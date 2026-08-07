package br.com.suzanoit.qa.modules.core.presentation


import br.com.suzanoit.qa.modules.core.application.TestCaseService
import br.com.suzanoit.qa.modules.core.presentation.dto.CreateTestCaseRequest
import br.com.suzanoit.qa.modules.core.presentation.dto.UpdateTestCaseRequest
import br.com.suzanoit.qa.modules.core.presentation.dto.TestCaseResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/test-cases")
@CrossOrigin(origins = ["*"])
class TestCaseController(private val testCaseService: TestCaseService) {

    @GetMapping
    fun getAllTestCases(): ResponseEntity<List<TestCaseResponse>> {
        return ResponseEntity.ok(testCaseService.getAllTestCases())
    }

    @GetMapping("/{id}")
    fun getTestCase(@PathVariable id: String): ResponseEntity<TestCaseResponse> {
        return ResponseEntity.ok(testCaseService.getTestCase(id))
    }

    @PostMapping
    fun createTestCase(@RequestBody request: CreateTestCaseRequest): ResponseEntity<TestCaseResponse> {
        return ResponseEntity.status(HttpStatus.CREATED).body(testCaseService.createTestCase(request))
    }

    @PutMapping("/{id}")
    fun updateTestCase(@PathVariable id: String, @RequestBody request: UpdateTestCaseRequest): ResponseEntity<TestCaseResponse> {
        return ResponseEntity.ok(testCaseService.updateTestCase(id, request))
    }

    @DeleteMapping("/{id}")
    fun deleteTestCase(@PathVariable id: String): ResponseEntity<Void> {
        testCaseService.deleteTestCase(id)
        return ResponseEntity.noContent().build()
    }
}