package br.com.suzanoit.qa.modules.api_testing.domain

import java.time.LocalDateTime
import java.util.UUID

data class ApiExecutionResult(
    val id: String = UUID.randomUUID().toString(),
    var tenantId: String,
    var executionId: String,
    var requestId: String,
    var statusCode: Int?,
    var responseTimeMs: Long?,
    var responseBody: String?,
    var responseHeaders: String?,
    var assertionsResult: String?, // JSON array
    val createdAt: LocalDateTime = LocalDateTime.now()
)
