package br.com.suzanoit.qa.modules.integrations.infrastructure.jpa

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.Column
import org.hibernate.annotations.TenantId
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
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}
