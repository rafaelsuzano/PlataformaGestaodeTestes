package br.com.suzanoit.qa.modules.api_testing.domain

import java.time.LocalDateTime
import java.util.UUID

data class ApiAssertion(
    val id: String = UUID.randomUUID().toString(),
    var tenantId: String,
    var requestId: String,
    var source: String, // STATUS_CODE, RESPONSE_TIME, HEADER, JSON_BODY
    var propertyPath: String?,
    var operator: String, // EQUALS, EXISTS, CONTAINS, GT, LT
    var expectedValue: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
