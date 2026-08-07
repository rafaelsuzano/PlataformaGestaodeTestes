package br.com.suzanoit.qa.modules.core.domain

import java.time.LocalDateTime
import java.util.UUID

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

