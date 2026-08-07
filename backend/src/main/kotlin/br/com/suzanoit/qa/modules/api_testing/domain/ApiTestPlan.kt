package br.com.suzanoit.qa.modules.api_testing.domain

import java.time.LocalDateTime
import java.util.UUID

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

