package br.com.suzanoit.qa.modules.projects.infrastructure.jpa

import br.com.suzanoit.qa.modules.core.domain.Category
import br.com.suzanoit.qa.modules.projects.domain.Environment
import br.com.suzanoit.qa.modules.projects.domain.Feature
import br.com.suzanoit.qa.modules.core.domain.Module
import br.com.suzanoit.qa.modules.projects.domain.Project
import br.com.suzanoit.qa.modules.projects.domain.Requirement
import br.com.suzanoit.qa.modules.projects.domain.Sprint
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.TenantId
import java.time.LocalDateTime

@Entity
@Table(name = "projects")
class ProjectJpaEntity(
    @Id var id: String,
    var name: String,
    var description: String?,
    var version: String?,
    var status: String,
    var managerName: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = Project(id, name, description, version, status, managerName, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: Project) = ProjectJpaEntity(
            domain.id, domain.name, domain.description, domain.version, domain.status, domain.managerName, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "sprints")
class SprintJpaEntity(
    @Id var id: String,
    var projectId: String,
    var name: String,
    var goal: String?,
    var startDate: LocalDateTime?,
    var endDate: LocalDateTime?,
    var status: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = Sprint(id, projectId, name, goal, startDate, endDate, status, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: Sprint) = SprintJpaEntity(
            domain.id ?: java.util.UUID.randomUUID().toString(), domain.projectId, domain.name, domain.goal, domain.startDate, domain.endDate, domain.status, domain.createdAt ?: LocalDateTime.now(), domain.updatedAt ?: LocalDateTime.now()
        )
    }
}

@Entity
@Table(name = "modules")
class ModuleJpaEntity(
    @Id var id: String,
    var projectId: String,
    var name: String,
    var description: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = Module(id, projectId, name, description, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: Module) = ModuleJpaEntity(
            domain.id, domain.projectId, domain.name, domain.description, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "categories")
class CategoryJpaEntity(
    @Id var id: String,
    var name: String,
    var description: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = Category(id, name, description, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: Category) = CategoryJpaEntity(
            domain.id, domain.name, domain.description, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "requirements")
class RequirementJpaEntity(
    @Id var id: String,
    var projectId: String,
    var code: String,
    var title: String,
    var description: String?,
    var source: String?,
    var priority: String,
    var criticality: String,
    var sprint: String?,
    var releaseVersion: String?,
    var status: String,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = Requirement(
        id, projectId, code, title, description, source, priority, criticality, sprint, releaseVersion, status, createdAt, updatedAt
    )
    companion object {
        fun fromDomain(domain: Requirement) = RequirementJpaEntity(
            domain.id, domain.projectId, domain.code, domain.title, domain.description, domain.source, domain.priority, domain.criticality, domain.sprint, domain.releaseVersion, domain.status, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "features")
class FeatureJpaEntity(
    @Id var id: String,
    var moduleId: String,
    var categoryId: String?,
    var code: String?,
    var name: String,
    var description: String?,
    var objective: String?,
    var status: String?,
    var priority: String?,
    var version: String?,
    var permissions: String?,
    var dependencies: String?,
    var tags: String?,
    var iconName: String?,
    var color: String?,
    var menuOrder: Int,
    var url: String?,
    var visibleInMenu: Boolean,
    var showInDashboard: Boolean,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = Feature(
        id, moduleId, categoryId, code, name, description, objective, status, priority, version, permissions, dependencies, tags, iconName, color, menuOrder, url, visibleInMenu, showInDashboard, createdAt, updatedAt
    )
    companion object {
        fun fromDomain(domain: Feature) = FeatureJpaEntity(
            domain.id, domain.moduleId, domain.categoryId, domain.code, domain.name, domain.description, domain.objective, domain.status, domain.priority, domain.version, domain.permissions, domain.dependencies, domain.tags, domain.iconName, domain.color, domain.menuOrder, domain.url, domain.visibleInMenu, domain.showInDashboard, domain.createdAt, domain.updatedAt
        )
    }
}

@Entity
@Table(name = "environments")
class EnvironmentJpaEntity(
    @Id var id: String,
    var name: String,
    var description: String?,
    var baseUrl: String?,
    var type: String?,
    var status: String,
    var color: String?,
    var icon: String?,
    var createdAt: LocalDateTime,
    var updatedAt: LocalDateTime
) {
    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
    fun toDomain() = Environment(id, name, description, baseUrl, type, status, color, icon, createdAt, updatedAt)
    companion object {
        fun fromDomain(domain: Environment) = EnvironmentJpaEntity(
            domain.id, domain.name, domain.description, domain.baseUrl, domain.type, domain.status, domain.color, domain.icon, domain.createdAt, domain.updatedAt
        )
    }
}
