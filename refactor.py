import os

base_path = "backend/src/main/kotlin/br/com/suzanoit/qa/modules"

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

files_to_create = {
    # ------------------ INTEGRATIONS ------------------
    f"{base_path}/integrations/infrastructure/jpa/IntegrationJpaEntities.kt": """package br.com.suzanoit.qa.modules.integrations.infrastructure.jpa

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "integrations")
class IntegrationConfigJpaEntity(
    @Id var id: String,
    var type: String,
    var url: String,
    var apiToken: String,
    var projectId: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
)
""",
    # ------------------ API TESTING ------------------
    f"{base_path}/api_testing/infrastructure/jpa/ApiTestingJpaEntities.kt": """package br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "api_test_plans")
class ApiTestPlanJpaEntity(
    @Id var id: String,
    var name: String,
    var description: String?,
    var projectId: String?,
    var testCaseId: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
)

@Entity
@Table(name = "api_test_requests")
class ApiTestRequestJpaEntity(
    @Id var id: String,
    var planId: String,
    var name: String,
    var method: String,
    var url: String,
    var headers: String?,
    var body: String?,
    var expectedStatus: Int,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
)

@Entity
@Table(name = "api_test_executions")
class ApiTestExecutionJpaEntity(
    @Id var id: String,
    var planId: String,
    var status: String,
    var executionTimeMs: Long,
    var successRate: Double,
    var createdAt: LocalDateTime
)
"""
}

for filepath, content in files_to_create.items():
    ensure_dir(os.path.dirname(filepath))
    with open(filepath, "w") as f:
        f.write(content)

print("Additional files created successfully.")
