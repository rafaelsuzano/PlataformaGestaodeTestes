package br.com.suzanoit.qa.modules.core.infrastructure.jpa

import br.com.suzanoit.qa.modules.shared.domain.Defect
import br.com.suzanoit.qa.modules.shared.domain.TestCase
import br.com.suzanoit.qa.modules.shared.domain.TestCaseFolder
import br.com.suzanoit.qa.modules.shared.domain.TestStep
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.TenantId
import java.time.LocalDateTime

@Entity
@Table(name = "test_case_folders")
class TestCaseFolderJpaEntity(
    @Id var id: String,
    var projectId: String,
    var parentId: String?,
    var name: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = TestCaseFolder(id, projectId, parentId, name, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: TestCaseFolder) = TestCaseFolderJpaEntity(
            domain.id, domain.projectId, domain.parentId, domain.name, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "test_cases")
class TestCaseJpaEntity(
    @Id var id: String,
    var featureId: String?,
    var folderId: String?,
    var requirementId: String?,
    var title: String,
    var description: String?,
    var type: String,
    var status: String,
    var gherkinContent: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = TestCase(id, featureId, folderId, requirementId, title, description, type, status, gherkinContent, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: TestCase) = TestCaseJpaEntity(
            domain.id, domain.featureId, domain.folderId, domain.requirementId, domain.title, domain.description, domain.type, domain.status, domain.gherkinContent, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "test_steps")
class TestStepJpaEntity(
    @Id var id: String,
    var testCaseId: String,
    var stepNumber: Int,
    var action: String,
    var expectedResult: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = TestStep(id, testCaseId, stepNumber, action, expectedResult, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: TestStep) = TestStepJpaEntity(
            domain.id, domain.testCaseId, domain.stepNumber, domain.action, domain.expectedResult, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "defects")
class DefectJpaEntity(
    @Id var id: String,
    var testExecutionId: String?,
    var testCaseId: String,
    var title: String,
    var description: String?,
    var severity: String,
    var status: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = Defect(id, testExecutionId, testCaseId, title, description, severity, status, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: Defect) = DefectJpaEntity(
            domain.id, domain.testExecutionId, domain.testCaseId, domain.title, domain.description, domain.severity, domain.status, domain.createdAt, domain.updatedAt
        )
    }
}
