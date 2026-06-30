package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.TestPlan
import br.com.suzanoit.qa.core.domain.TestPlanRepository
import br.com.suzanoit.qa.core.domain.TestExecution
import br.com.suzanoit.qa.core.domain.TestExecutionRepository
import org.springframework.stereotype.Service

data class CreateTestPlanRequest(
    val testPlan: TestPlan,
    val testCaseIds: List<String>
)

@Service
class TestPlanService(
    private val testPlanRepository: TestPlanRepository,
    private val testExecutionRepository: TestExecutionRepository
) {
    fun createTestPlan(request: CreateTestPlanRequest): TestPlan {
        val savedPlan = testPlanRepository.save(request.testPlan)
        
        // Generate a pending test execution for each associated test case
        request.testCaseIds.forEach { testCaseId ->
            val execution = TestExecution(
                name = savedPlan.name,
                sprint = savedPlan.sprintId,
                testCaseId = testCaseId,
                testPlanId = savedPlan.id,
                testerId = null,
                environment = savedPlan.environment,
                status = "PENDING",
                startedAt = null,
                completedAt = null
            )
            testExecutionRepository.save(execution)
        }
        
        return savedPlan
    }

    fun getTestPlan(id: String): TestPlan? = testPlanRepository.findById(id)

    fun getTestPlansByProject(projectId: String): List<TestPlan> = testPlanRepository.findByProjectId(projectId)

    fun updateTestPlan(plan: TestPlan): TestPlan = testPlanRepository.save(plan)

    fun deleteTestPlan(id: String) {
        testPlanRepository.delete(id)
    }
}
