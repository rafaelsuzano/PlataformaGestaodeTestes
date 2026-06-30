package br.com.suzanoit.qa.infrastructure.persistence.jpa

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.Column
import jakarta.persistence.IdClass
import java.time.LocalDateTime

import br.com.suzanoit.qa.core.domain.Project

@Entity
@Table(name = "projects")
class ProjectJpaEntity(
    @Id
    var id: String,

    var name: String,
    var description: String?,
    var version: String?,
    var status: String,
    var managerName: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = Project(id, name, description, version, status, managerName, createdAt, updatedAt)

    companion object {
        fun fromDomain(domain: Project) = ProjectJpaEntity(
            domain.id, domain.name, domain.description, domain.version, domain.status, domain.managerName, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "sprints")
class SprintJpaEntity(
    @Id var id: String,
    var projectId: String,
    var name: String,
    var goal: String?,
    var startDate: LocalDateTime?,
    var endDate: LocalDateTime?,
    var status: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.Sprint(id, projectId, name, goal, startDate, endDate, status, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.Sprint) = SprintJpaEntity(
            domain.id, domain.projectId, domain.name, domain.goal, domain.startDate, domain.endDate, domain.status, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "users")
class UserJpaEntity(
    @Id var id: String,
    var name: String,
    var email: String,
    var password: String,
    var profile: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
)

@Entity
@Table(name = "user_projects")
@IdClass(UserProjectId::class)
class UserProjectJpaEntity(
    @Id var userId: String,
    @Id var projectId: String
)

data class UserProjectId(
    var userId: String = "",
    var projectId: String = ""
) : java.io.Serializable

@Entity
@Table(name = "integrations")
class IntegrationConfigJpaEntity(
    @Id var id: String,
    var type: String,
    var url: String,
    var apiToken: String,
    var projectId: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
)

@Entity
@Table(name = "api_test_plans")
class ApiTestPlanJpaEntity(
    @Id var id: String,
    var name: String,
    var description: String?,
    var projectId: String?,
    var testCaseId: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
)

@Entity
@Table(name = "api_test_requests")
class ApiTestRequestJpaEntity(
    @Id var id: String,
    var planId: String,
    var name: String,
    var method: String,
    var url: String,
    var headers: String?,
    var body: String?,
    var expectedStatus: Int,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
)

@Entity
@Table(name = "api_test_executions")
class ApiTestExecutionJpaEntity(
    @Id var id: String,
    var planId: String,
    var status: String,
    var executionTimeMs: Long,
    var successRate: Double,
    var createdAt: LocalDateTime
)

@Entity
@Table(name = "modules")
class ModuleJpaEntity(
    @Id var id: String,
    var projectId: String,
    var name: String,
    var description: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.Module(id, projectId, name, description, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.Module) = ModuleJpaEntity(
            domain.id, domain.projectId, domain.name, domain.description, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "categories")
class CategoryJpaEntity(
    @Id var id: String,
    var name: String,
    var description: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.Category(id, name, description, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.Category) = CategoryJpaEntity(
            domain.id, domain.name, domain.description, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "requirements")
class RequirementJpaEntity(
    @Id var id: String,
    var projectId: String,
    var code: String,
    var title: String,
    var description: String?,
    var source: String?,
    var priority: String,
    var criticality: String,
    var sprint: String?,
    var releaseVersion: String?,
    var status: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.Requirement(
        id, projectId, code, title, description, source, priority, criticality, sprint, releaseVersion, status, createdAt, updatedAt
    )
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.Requirement) = RequirementJpaEntity(
            domain.id, domain.projectId, domain.code, domain.title, domain.description, domain.source, domain.priority, domain.criticality, domain.sprint, domain.releaseVersion, domain.status, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "features")
class FeatureJpaEntity(
    @Id var id: String,
    var moduleId: String,
    var name: String,
    var description: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.Feature(id, moduleId, name, description, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.Feature) = FeatureJpaEntity(
            domain.id, domain.moduleId, domain.name, domain.description, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "test_case_folders")
class TestCaseFolderJpaEntity(
    @Id var id: String,
    var projectId: String,
    var parentId: String?,
    var name: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.TestCaseFolder(id, projectId, parentId, name, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.TestCaseFolder) = TestCaseFolderJpaEntity(
            domain.id, domain.projectId, domain.parentId, domain.name, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "test_cases")
class TestCaseJpaEntity(
    @Id var id: String,
    var featureId: String?,
    var folderId: String?,
    var requirementId: String?,
    var title: String,
    var description: String?,
    var type: String,
    var status: String,
    var gherkinContent: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.TestCase(id, featureId, folderId, requirementId, title, description, type, status, gherkinContent, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.TestCase) = TestCaseJpaEntity(
            domain.id, domain.featureId, domain.folderId, domain.requirementId, domain.title, domain.description, domain.type, domain.status, domain.gherkinContent, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "test_steps")
class TestStepJpaEntity(
    @Id var id: String,
    var testCaseId: String,
    var stepNumber: Int,
    var action: String,
    var expectedResult: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.TestStep(id, testCaseId, stepNumber, action, expectedResult, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.TestStep) = TestStepJpaEntity(
            domain.id, domain.testCaseId, domain.stepNumber, domain.action, domain.expectedResult, domain.createdAt, domain.updatedAt
        )
    }
}

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
    var startedAt: LocalDateTime?,
    var completedAt: LocalDateTime?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.TestExecution(id, name, sprint, testCaseId, testPlanId, testerId, environment, status, startedAt, completedAt, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.TestExecution) = TestExecutionJpaEntity(
            domain.id, domain.name, domain.sprint, domain.testCaseId, domain.testPlanId, domain.testerId, domain.environment, domain.status, domain.startedAt, domain.completedAt, domain.createdAt, domain.updatedAt
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
    fun toDomain() = br.com.suzanoit.qa.core.domain.TestExecutionStep(id, testExecutionId, testStepId, stepNumber, action, expectedResult, actualResult, status, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.TestExecutionStep) = TestExecutionStepJpaEntity(
            domain.id, domain.testExecutionId, domain.testStepId, domain.stepNumber, domain.action, domain.expectedResult, domain.actualResult, domain.status, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "defects")
class DefectJpaEntity(
    @Id var id: String,
    var testExecutionId: String?,
    var testCaseId: String,
    var title: String,
    var description: String?,
    var severity: String,
    var status: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.Defect(id, testExecutionId, testCaseId, title, description, severity, status, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.Defect) = DefectJpaEntity(
            domain.id, domain.testExecutionId, domain.testCaseId, domain.title, domain.description, domain.severity, domain.status, domain.createdAt, domain.updatedAt
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
    fun toDomain() = br.com.suzanoit.qa.core.domain.TestPlan(id, projectId, sprintId, name, description, environment, status, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.TestPlan) = TestPlanJpaEntity(
            domain.id, domain.projectId, domain.sprintId, domain.name, domain.description, domain.environment, domain.status, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "environments")
class EnvironmentJpaEntity(
    @Id var id: String,
    var name: String,
    var description: String?,
    var baseUrl: String?,
    var type: String?,
    var status: String,
    var color: String?,
    var icon: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.Environment(id, name, description, baseUrl, type, status, color, icon, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.Environment) = EnvironmentJpaEntity(
            domain.id, domain.name, domain.description, domain.baseUrl, domain.type, domain.status, domain.color, domain.icon, domain.createdAt, domain.updatedAt
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
    fun toDomain() = br.com.suzanoit.qa.core.domain.ExecutionHistory(id, testExecutionId, testCaseId, environmentId, userId, startTime, endTime, durationMs, totalSteps, passedSteps, failedSteps, blockedSteps, status, browser, browserVersion, observations)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.ExecutionHistory) = ExecutionHistoryJpaEntity(
            domain.id, domain.testExecutionId, domain.testCaseId, domain.environmentId, domain.userId, domain.startTime, domain.endTime, domain.durationMs, domain.totalSteps, domain.passedSteps, domain.failedSteps, domain.blockedSteps, domain.status, domain.browser, domain.browserVersion, domain.observations
        )
    }
}

@Entity
@Table(name = "system_logs")
class SystemLogJpaEntity(
    @Id var id: String,
    var userId: String?,
    var actionType: String,
    var module: String,
    var description: String?,
    var ipAddress: String?,
    var browser: String?,
    var result: String?,
    var createdAt: LocalDateTime
) {
    fun toDomain() = br.com.suzanoit.qa.core.domain.SystemLog(id, userId, actionType, module, description, ipAddress, browser, result, createdAt)
    companion object {
        fun fromDomain(domain: br.com.suzanoit.qa.core.domain.SystemLog) = SystemLogJpaEntity(
            domain.id, domain.userId, domain.actionType, domain.module, domain.description, domain.ipAddress, domain.browser, domain.result, domain.createdAt
        )
    }
}
