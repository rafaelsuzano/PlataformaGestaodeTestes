package br.com.suzanoit.qa.modules.executions.infrastructure.jpa

import br.com.suzanoit.qa.modules.shared.domain.ExecutionHistory
import br.com.suzanoit.qa.modules.shared.domain.TestExecution
import br.com.suzanoit.qa.modules.shared.domain.TestExecutionStep
import br.com.suzanoit.qa.modules.shared.domain.TestPlan
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.TenantId
import java.time.LocalDateTime

@Entity
@Table(name = "test_executions")
class TestExecutionJpaEntity(
    @Id var id: String,
    var name: String?,
    var sprint: String?,
    var testCaseId: String,
    var testPlanId: String?,
    var testerId: String?,
    var environment: String?,
    var status: String,
    var repositoryProvider: String?,
    var repositoryUrl: String?,
    var repositoryBranch: String?,
    var startedAt: LocalDateTime?,
    var completedAt: LocalDateTime?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = TestExecution(id, name, sprint, testCaseId, testPlanId, testerId, environment, status, repositoryProvider, repositoryUrl, repositoryBranch, startedAt, completedAt, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: TestExecution) = TestExecutionJpaEntity(
            domain.id ?: java.util.UUID.randomUUID().toString(), domain.name, domain.sprint, domain.testCaseId, domain.testPlanId, domain.testerId, domain.environment, domain.status, domain.repositoryProvider, domain.repositoryUrl, domain.repositoryBranch, domain.startedAt, domain.completedAt, domain.createdAt ?: LocalDateTime.now(), domain.updatedAt ?: LocalDateTime.now()
        )
    }
}

@Entity
@Table(name = "test_execution_steps")
class TestExecutionStepJpaEntity(
    @Id var id: String,
    var testExecutionId: String,
    var testStepId: String?,
    var stepNumber: Int,
    var action: String,
    var expectedResult: String,
    var actualResult: String?,
    var status: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = TestExecutionStep(id, testExecutionId, testStepId, stepNumber, action, expectedResult, actualResult, status, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: TestExecutionStep) = TestExecutionStepJpaEntity(
            domain.id, domain.testExecutionId, domain.testStepId, domain.stepNumber, domain.action, domain.expectedResult, domain.actualResult, domain.status, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "test_plans")
class TestPlanJpaEntity(
    @Id var id: String,
    var projectId: String,
    var sprintId: String?,
    var name: String,
    var description: String?,
    var environment: String?,
    var status: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = TestPlan(id, projectId, sprintId, name, description, environment, status, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: TestPlan) = TestPlanJpaEntity(
            domain.id, domain.projectId, domain.sprintId, domain.name, domain.description, domain.environment, domain.status, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "execution_history")
class ExecutionHistoryJpaEntity(
    @Id var id: String,
    var testExecutionId: String?,
    var testCaseId: String,
    var environmentId: String?,
    var userId: String?,
    var startTime: LocalDateTime?,
    var endTime: LocalDateTime?,
    var durationMs: Long?,
    var totalSteps: Int,
    var passedSteps: Int,
    var failedSteps: Int,
    var blockedSteps: Int,
    var status: String,
    var browser: String?,
    var browserVersion: String?,
    var observations: String?
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = ExecutionHistory(id, testExecutionId, testCaseId, environmentId, userId, startTime, endTime, durationMs, totalSteps, passedSteps, failedSteps, blockedSteps, status, browser, browserVersion, observations)
    companion object {
        fun fromDomain(domain: ExecutionHistory) = ExecutionHistoryJpaEntity(
            domain.id, domain.testExecutionId, domain.testCaseId, domain.environmentId, domain.userId, domain.startTime, domain.endTime, domain.durationMs, domain.totalSteps, domain.passedSteps, domain.failedSteps, domain.blockedSteps, domain.status, domain.browser, domain.browserVersion, domain.observations
        )
    }
}
