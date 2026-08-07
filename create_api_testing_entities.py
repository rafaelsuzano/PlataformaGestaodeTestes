import os

path = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/api_testing/domain"
os.makedirs(path, exist_ok=True)

entities = {
    "ApiCollection.kt": """package br.com.suzanoit.qa.modules.api_testing.domain

import java.time.LocalDateTime
import java.util.UUID

data class ApiCollection(
    val id: String = UUID.randomUUID().toString(),
    var tenantId: String,
    var projectId: String,
    var parentId: String?,
    var name: String,
    var description: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
""",
    "ApiEnvironment.kt": """package br.com.suzanoit.qa.modules.api_testing.domain

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
""",
    "ApiVariable.kt": """package br.com.suzanoit.qa.modules.api_testing.domain

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
""",
    "ApiAssertion.kt": """package br.com.suzanoit.qa.modules.api_testing.domain

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
""",
    "ApiExecutionResult.kt": """package br.com.suzanoit.qa.modules.api_testing.domain

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
"""
}

for filename, content in entities.items():
    with open(os.path.join(path, filename), "w") as f:
        f.write(content)
    print(f"Created {filename}")
