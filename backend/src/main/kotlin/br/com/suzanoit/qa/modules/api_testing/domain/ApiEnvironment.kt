package br.com.suzanoit.qa.modules.api_testing.domain

import java.time.LocalDateTime
import java.util.UUID

data class ApiEnvironment(
    val id: String = UUID.randomUUID().toString(),
    var tenantId: String,
    var projectId: String,
    var name: String,
    var color: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
