package br.com.suzanoit.qa.modules.api_testing.domain

import java.time.LocalDateTime
import java.util.UUID

data class ApiTestRequest(
    val id: String = UUID.randomUUID().toString(),
    var tenantId: String? = null,
    var collectionId: String? = null,
    val planId: String?,
    val name: String,
    val method: String,
    val url: String,
    val headers: String?, // JSON string of headers
    var bodyType: String? = "JSON",
    val body: String?,
    var preRequestScript: String? = null,
    var postResponseScript: String? = null,
    var authType: String? = "NO_AUTH",
    var authConfig: String? = null,
    val expectedStatus: Int,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

