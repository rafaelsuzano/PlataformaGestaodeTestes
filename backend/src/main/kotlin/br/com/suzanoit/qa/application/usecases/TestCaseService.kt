package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.TestCase
import br.com.suzanoit.qa.core.domain.TestCaseRepository
import org.springframework.stereotype.Service

@Service
class TestCaseService(private val repository: TestCaseRepository) {
    fun createTestCase(testCase: TestCase): TestCase = repository.save(testCase)
    fun updateTestCase(id: String, testCase: TestCase): TestCase? {
        val existing = repository.findById(id) ?: return null
        val updated = existing.copy(
            title = testCase.title,
            description = testCase.description,
            type = testCase.type,
            status = testCase.status,
            gherkinContent = testCase.gherkinContent,
            requirementId = testCase.requirementId,
            featureId = testCase.featureId,
            folderId = testCase.folderId
        )
        return repository.save(updated)
    }
    fun getTestCase(id: String): TestCase? = repository.findById(id)
    fun getAllTestCases(): List<TestCase> = repository.findAll()
    fun deleteTestCase(id: String) = repository.delete(id)
}
