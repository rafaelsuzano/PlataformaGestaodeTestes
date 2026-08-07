import os

file_path = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/api_testing/infrastructure/jpa/ApiTestingJpaEntities.kt"

with open(file_path, "r") as f:
    content = f.read()

# Update ApiTestRequestJpaEntity
content = content.replace("var planId: String,", "var collectionId: String?,\n    var planId: String?,")
content = content.replace("var headers: String?,", "var headers: String?,\n    var bodyType: String?,\n    var preRequestScript: String?,\n    var postResponseScript: String?,\n    var authType: String?,\n    var authConfig: String?,")

# Update ApiTestExecutionJpaEntity
content = content.replace("var planId: String,", "var environmentId: String?,\n    var executionType: String,\n    var planId: String?,")
content = content.replace("var successRate: Double,", "var totalPassed: Int,\n    var totalFailed: Int,\n    var successRate: Double,")

new_entities = """

@Entity
@Table(name = "api_collections")
class ApiCollectionJpaEntity(
    @Id var id: String,
    var projectId: String,
    var parentId: String?,
    var name: String,
    var description: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}

@Entity
@Table(name = "api_environments")
class ApiEnvironmentJpaEntity(
    @Id var id: String,
    var projectId: String,
    var name: String,
    var color: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}

@Entity
@Table(name = "api_variables")
class ApiVariableJpaEntity(
    @Id var id: String,
    var scope: String,
    var scopeId: String?,
    var keyName: String,
    var valueData: String?,
    var isSecret: Boolean,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}

@Entity
@Table(name = "api_assertions")
class ApiAssertionJpaEntity(
    @Id var id: String,
    var requestId: String,
    var source: String,
    var propertyPath: String?,
    var operator: String,
    var expectedValue: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}

@Entity
@Table(name = "api_execution_results")
class ApiExecutionResultJpaEntity(
    @Id var id: String,
    var executionId: String,
    var requestId: String,
    var statusCode: Int?,
    var responseTimeMs: Long?,
    var responseBody: String?,
    var responseHeaders: String?,
    var assertionsResult: String?,
    var createdAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}
"""

with open(file_path, "w") as f:
    f.write(content + new_entities)

print("Updated JPA entities")
