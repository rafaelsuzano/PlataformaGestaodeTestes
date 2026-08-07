package br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.Column
import org.hibernate.annotations.TenantId
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
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}

@Entity
@Table(name = "api_test_requests")
class ApiTestRequestJpaEntity(
    @Id var id: String,
    var collectionId: String?,
    var planId: String?,
    var name: String,
    var method: String,
    var url: String,
    var headers: String?,
    var bodyType: String?,
    var preRequestScript: String?,
    var postResponseScript: String?,
    var authType: String?,
    var authConfig: String?,
    var body: String?,
    var expectedStatus: Int,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}

@Entity
@Table(name = "api_test_executions")
class ApiTestExecutionJpaEntity(
    @Id var id: String,
    var collectionId: String?,
    var planId: String?,
    var status: String,
    var executionTimeMs: Long,
    var totalPassed: Int,
    var totalFailed: Int,
    var successRate: Double,
    var createdAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}


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
