package br.com.suzanoit.qa.modules.api_testing.domain

import java.time.LocalDateTime
import java.util.UUID

data class ApiTestExecution(
    val id: String = UUID.randomUUID().toString(),
    var environmentId: String? = null,
    var executionType: String = "SINGLE",
    val planId: String?,
    val status: String, // PASSED, FAILED
    val executionTimeMs: Long,
    var totalPassed: Int = 0,
    var totalFailed: Int = 0,
    val successRate: Double,
    val createdAt: LocalDateTime = LocalDateTime.now()
)

