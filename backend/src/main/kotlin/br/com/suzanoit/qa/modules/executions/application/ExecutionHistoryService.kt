package br.com.suzanoit.qa.modules.executions.application

import br.com.suzanoit.qa.modules.shared.domain.ExecutionHistory
import br.com.suzanoit.qa.modules.shared.domain.ExecutionHistoryRepository
import org.springframework.stereotype.Service

@Service
class ExecutionHistoryService(
    private val executionHistoryRepository: ExecutionHistoryRepository,
    private val systemLogService: SystemLogService
) {
    fun createExecutionHistory(history: ExecutionHistory, userId: String?): ExecutionHistory {
        val saved = executionHistoryRepository.save(history)
        systemLogService.logAction(userId, "EXECUTE_TEST", "Execução", "Caso de Teste ${saved.testCaseId} executado no ambiente ${saved.environmentId}")
        return saved
    }

    fun getHistory(id: String): ExecutionHistory? = executionHistoryRepository.findById(id)

    fun getAllHistory(): List<ExecutionHistory> = executionHistoryRepository.findAll().sortedByDescending { it.startTime }
}