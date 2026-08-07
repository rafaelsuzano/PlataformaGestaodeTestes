package br.com.suzanoit.qa.modules.core.application


import br.com.suzanoit.qa.modules.core.presentation.dto.*
import br.com.suzanoit.qa.modules.shared.domain.TestCase
import br.com.suzanoit.qa.modules.shared.domain.TestCaseRepository
import br.com.suzanoit.qa.modules.shared.domain.exceptions.ResourceNotFoundException
import org.springframework.stereotype.Service

@Service
class TestCaseService(private val repository: TestCaseRepository) {
    
    fun createTestCase(request: CreateTestCaseRequest): TestCaseResponse {
        val testCase = repository.save(request.toDomain())
        return testCase.toResponse()
    }
    
    fun updateTestCase(id: String, request: UpdateTestCaseRequest): TestCaseResponse {
        val existing = repository.findById(id) ?: throw ResourceNotFoundException("TestCase", "id", id)
        val updated = existing.copy(
            title = request.title ?: existing.title,
            description = request.description ?: existing.description,
            type = request.type ?: existing.type,
            status = request.status ?: existing.status,
            gherkinContent = request.gherkinContent ?: existing.gherkinContent,
            requirementId = request.requirementId ?: existing.requirementId,
            featureId = request.featureId ?: existing.featureId,
            folderId = request.folderId ?: existing.folderId
        )
        return repository.save(updated).toResponse()
    }
    
    fun getTestCase(id: String): TestCaseResponse {
        val testCase = repository.findById(id) ?: throw ResourceNotFoundException("TestCase", "id", id)
        return testCase.toResponse()
    }
    
    fun getAllTestCases(): List<TestCaseResponse> {
        return repository.findAll().map { it.toResponse() }
    }
    
    fun deleteTestCase(id: String) {
        repository.findById(id) ?: throw ResourceNotFoundException("TestCase", "id", id)
        repository.delete(id)
    }
}