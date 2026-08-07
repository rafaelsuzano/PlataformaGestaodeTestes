package br.com.suzanoit.qa.modules.audit.infrastructure.jpa

import br.com.suzanoit.qa.modules.audit.domain.SystemLog
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.TenantId
import java.time.LocalDateTime

@Entity
@Table(name = "system_logs")
class SystemLogJpaEntity(
    @Id var id: String,
    var userId: String?,
    var actionType: String,
    var module: String,
    var description: String?,
    var ipAddress: String?,
    var browser: String?,
    var result: String?,
    var createdAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = SystemLog(id, userId, actionType, module, description, ipAddress, browser, result, createdAt)
    companion object {
        fun fromDomain(domain: SystemLog) = SystemLogJpaEntity(
            domain.id, domain.userId, domain.actionType, domain.module, domain.description, domain.ipAddress, domain.browser, domain.result, domain.createdAt
        )
    }
}
