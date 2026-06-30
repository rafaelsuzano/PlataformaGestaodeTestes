package br.com.suzanoit.qa.core.domain

import java.time.LocalDateTime
import java.util.UUID

data class Project(
    val id: String = UUID.randomUUID().toString(),

    val name: String,
    val description: String?,
    val version: String?,
    val status: String,
    val managerName: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class Sprint(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val name: String,
    val goal: String?,
    val startDate: LocalDateTime?,
    val endDate: LocalDateTime?,
    val status: String, // PLANEJADA, ATIVA, CONCLUIDA
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class User(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val email: String,
    val password: String, // Em produção usaria BCrypt
    val profile: String, // ADMIN, QA, DEV, PO
    val projectIds: List<String> = emptyList(),
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class IntegrationConfig(
    val id: String = UUID.randomUUID().toString(),
    val type: String, // AZURE_DEVOPS, JIRA_XRAY, JIRA_ZEPHYR
    val url: String,
    val apiToken: String,
    val projectId: String? = null,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class ApiTestPlan(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val description: String?,
    val projectId: String?,
    val testCaseId: String? = null,
    val requests: List<ApiTestRequest> = emptyList(),
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class ApiTestRequest(
    val id: String = UUID.randomUUID().toString(),
    val planId: String,
    val name: String,
    val method: String,
    val url: String,
    val headers: String?, // JSON string of headers
    val body: String?,
    val expectedStatus: Int,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class ApiTestExecution(
    val id: String = UUID.randomUUID().toString(),
    val planId: String,
    val status: String, // PASSED, FAILED
    val executionTimeMs: Long,
    val successRate: Double,
    val createdAt: LocalDateTime = LocalDateTime.now()
)

data class Module(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val name: String,
    val description: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class Category(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val description: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class Requirement(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val code: String,
    val title: String,
    val description: String?,
    val source: String?,
    val priority: String,
    val criticality: String,
    val sprint: String?,
    val releaseVersion: String?,
    val status: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class Feature(
    val id: String = UUID.randomUUID().toString(),
    val moduleId: String,
    val name: String,
    val description: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class TestCaseFolder(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val parentId: String?,
    val name: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class TestCase(
    val id: String = UUID.randomUUID().toString(),
    val featureId: String?,
    val folderId: String?, // Pasta do Test Case (Árvore por Projeto)
    val requirementId: String?, // Vínculo com Requisito (Rastreabilidade)
    val title: String,
    val description: String?,
    val type: String, // MANUAL, AUTOMATED
    val status: String, // DRAFT, REVIEW, APPROVED, DEPRECATED
    val gherkinContent: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class TestStep(
    val id: String = UUID.randomUUID().toString(),
    val testCaseId: String,
    val stepNumber: Int,
    val action: String,
    val expectedResult: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class TestExecution(
    val id: String = UUID.randomUUID().toString(),
    val name: String?,
    val sprint: String?,
    val testCaseId: String,
    val testPlanId: String?, // Vinculo com o Plano de Testes
    val testerId: String?,
    val environment: String?,
    val status: String, // PENDING, IN_PROGRESS, PASSED, FAILED, BLOCKED
    val startedAt: LocalDateTime?,
    val completedAt: LocalDateTime?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class TestExecutionStep(
    val id: String = UUID.randomUUID().toString(),
    val testExecutionId: String,
    val testStepId: String?,
    val stepNumber: Int,
    val action: String,
    val expectedResult: String,
    val actualResult: String?,
    val status: String?, // PASSED, FAILED, BLOCKED
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class Defect(
    val id: String = UUID.randomUUID().toString(),
    val testExecutionId: String?,
    val testCaseId: String,
    val title: String,
    val description: String?,
    val severity: String, // LOW, MEDIUM, HIGH, CRITICAL
    val status: String, // OPEN, IN_PROGRESS, RESOLVED, CLOSED
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class TestPlan(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val sprintId: String?,
    val name: String,
    val description: String?,
    val environment: String?,
    val status: String, // DRAFT, IN_PROGRESS, COMPLETED
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class Environment(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val description: String?,
    val baseUrl: String?,
    val type: String?,
    val status: String,
    val color: String?,
    val icon: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

data class ExecutionHistory(
    val id: String = UUID.randomUUID().toString(),
    val testExecutionId: String?,
    val testCaseId: String,
    val environmentId: String?,
    val userId: String?,
    val startTime: LocalDateTime?,
    val endTime: LocalDateTime?,
    val durationMs: Long?,
    val totalSteps: Int,
    val passedSteps: Int,
    val failedSteps: Int,
    val blockedSteps: Int,
    val status: String,
    val browser: String?,
    val browserVersion: String?,
    val observations: String?
)

data class SystemLog(
    val id: String = UUID.randomUUID().toString(),
    val userId: String?,
    val actionType: String,
    val module: String,
    val description: String?,
    val ipAddress: String?,
    val browser: String?,
    val result: String?,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
