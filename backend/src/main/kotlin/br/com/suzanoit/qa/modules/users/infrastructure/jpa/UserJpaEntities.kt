package br.com.suzanoit.qa.modules.users.infrastructure.jpa

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.IdClass
import jakarta.persistence.Column
import org.hibernate.annotations.TenantId
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class UserJpaEntity(
    @Id var id: String,
    var name: String,
    var email: String,
    var password: String,
    var profile: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}

@Entity
@Table(name = "user_projects")
@IdClass(UserProjectId::class)
class UserProjectJpaEntity(
    @Id var userId: String,
    @Id var projectId: String
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
}

data class UserProjectId(
    var userId: String = "",
    var projectId: String = ""
) : java.io.Serializable
