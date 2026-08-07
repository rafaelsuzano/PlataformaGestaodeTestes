package br.com.suzanoit.qa.modules.executions.domain

import java.time.LocalDateTime
import java.util.UUID

data class TestExecution(
    val id: String? = null,
    val name: String? = null,
    val sprint: String? = null,
    val testCaseId: String,
    val testPlanId: String? = null,
    val testerId: String? = null,
    val environment: String? = null,
    val status: String, // PENDING, IN_PROGRESS, PASSED, FAILED, BLOCKED
    val repositoryProvider: String? = null,
    val repositoryUrl: String? = null,
    val repositoryBranch: String? = null,
    val startedAt: LocalDateTime? = null,
    val completedAt: LocalDateTime? = null,
    val createdAt: LocalDateTime? = null,
    val updatedAt: LocalDateTime? = null
)

