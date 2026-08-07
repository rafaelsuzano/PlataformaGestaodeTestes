package br.com.suzanoit.qa.modules.executions.domain

import java.time.LocalDateTime
import java.util.UUID

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

