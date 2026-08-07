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
    var planId: String,
    var name: String,
    var method: String,
    var url: String,
    var headers: String?,
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
    var planId: String,
    var status: String,
    var executionTimeMs: Long,
    var successRate: Double,
    var createdAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}
