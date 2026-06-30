package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.TestExecution
import br.com.suzanoit.qa.core.domain.TestExecutionRepository
import org.springframework.stereotype.Service

@Service
class TestExecutionService(
    private val repository: TestExecutionRepository,
    private val systemLogService: SystemLogService
) {
    fun createTestExecution(testExecution: TestExecution, userId: String? = null): TestExecution {
        val saved = repository.save(testExecution)
        systemLogService.logAction(userId, "CREATE_EXECUTION", "Execução", "Execução ${saved.id} criada para o caso ${saved.testCaseId}")
        return saved
    }
    fun getTestExecution(id: String): TestExecution? = repository.findById(id)
    fun getAllTestExecutions(): List<TestExecution> = repository.findAll()
    fun updateTestExecution(id: String, testExecution: TestExecution, userId: String? = null): TestExecution? {
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
        val saved = repository.save(updated)
        
        if (existing.status != updated.status) {
            systemLogService.logAction(userId, "UPDATE_EXECUTION_STATUS", "Execução", "Status da execução ${saved.id} alterado de ${existing.status} para ${updated.status}")
        }
        
        return saved
    }
    fun deleteTestExecution(id: String, userId: String? = null) {
        val existing = repository.findById(id)
        repository.delete(id)
        if (existing != null) {
            systemLogService.logAction(userId, "DELETE_EXECUTION", "Execução", "Execução ${existing.id} removida")
        }
    }
}
