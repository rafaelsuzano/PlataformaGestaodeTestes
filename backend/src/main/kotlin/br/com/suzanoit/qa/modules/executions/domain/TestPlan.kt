package br.com.suzanoit.qa.modules.executions.domain

import java.time.LocalDateTime
import java.util.UUID

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

