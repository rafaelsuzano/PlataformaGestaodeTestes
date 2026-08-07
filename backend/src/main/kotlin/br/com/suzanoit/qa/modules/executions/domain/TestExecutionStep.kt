package br.com.suzanoit.qa.modules.executions.domain

import java.time.LocalDateTime
import java.util.UUID

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

