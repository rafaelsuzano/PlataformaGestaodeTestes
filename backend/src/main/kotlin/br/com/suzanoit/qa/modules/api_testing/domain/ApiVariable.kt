package br.com.suzanoit.qa.modules.api_testing.domain

import java.time.LocalDateTime
import java.util.UUID

data class ApiVariable(
    val id: String = UUID.randomUUID().toString(),
    var tenantId: String,
    var scope: String, // GLOBAL, ENVIRONMENT, COLLECTION
    var scopeId: String?,
    var keyName: String,
    var valueData: String?,
    var isSecret: Boolean = false,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
