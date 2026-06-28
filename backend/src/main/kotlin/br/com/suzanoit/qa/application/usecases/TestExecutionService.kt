package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.TestExecution
import br.com.suzanoit.qa.core.domain.TestExecutionRepository
import org.springframework.stereotype.Service

@Service
class TestExecutionService(private val repository: TestExecutionRepository) {
    fun createTestExecution(testExecution: TestExecution): TestExecution = repository.save(testExecution)
    fun getTestExecution(id: String): TestExecution? = repository.findById(id)
    fun getAllTestExecutions(): List<TestExecution> = repository.findAll()
    fun updateTestExecution(id: String, testExecution: TestExecution): TestExecution? {
        val existing = repository.findById(id) ?: return null
        val updated = existing.copy(
            name = testExecution.name,
            sprint = testExecution.sprint,
            testerId = testExecution.testerId,
            environment = testExecution.environment,
            status = testExecution.status,
            startedAt = testExecution.startedAt,
            completedAt = testExecution.completedAt
        )
        return repository.save(updated)
    }
    fun deleteTestExecution(id: String) = repository.delete(id)
}
