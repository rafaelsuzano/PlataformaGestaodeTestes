package br.com.suzanoit.qa.modules.projects.presentation.dto

import java.time.LocalDateTime

data class CreateFeatureRequest(
    val moduleId: String,
    val categoryId: String? = null,
    val code: String? = null,
    val name: String,
    val description: String?,
    val objective: String? = null,
    val status: String? = null,
    val priority: String? = null,
    val version: String? = null,
    val permissions: String? = null,
    val dependencies: String? = null,
    val tags: String? = null,
    val iconName: String? = null,
    val color: String? = null,
    val menuOrder: Int = 0,
    val url: String? = null,
    val visibleInMenu: Boolean = true,
    val showInDashboard: Boolean = true
)

data class FeatureResponse(
    val id: String,
    val moduleId: String,
    val categoryId: String?,
    val code: String?,
    val name: String,
    val description: String?,
    val objective: String?,
    val status: String?,
    val priority: String?,
    val version: String?,
    val permissions: String?,
    val dependencies: String?,
    val tags: String?,
    val iconName: String?,
    val color: String?,
    val menuOrder: Int,
    val url: String?,
    val visibleInMenu: Boolean,
    val showInDashboard: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

fun CreateFeatureRequest.toDomain() = br.com.suzanoit.qa.modules.shared.domain.Feature(
    moduleId = this.moduleId,
    categoryId = this.categoryId,
    code = this.code,
    name = this.name,
    description = this.description,
    objective = this.objective,
    status = this.status,
    priority = this.priority,
    version = this.version,
    permissions = this.permissions,
    dependencies = this.dependencies,
    tags = this.tags,
    iconName = this.iconName,
    color = this.color,
    menuOrder = this.menuOrder,
    url = this.url,
    visibleInMenu = this.visibleInMenu,
    showInDashboard = this.showInDashboard
)

fun br.com.suzanoit.qa.modules.shared.domain.Feature.toResponse() = FeatureResponse(
    id = this.id,
    moduleId = this.moduleId,
    categoryId = this.categoryId,
    code = this.code,
    name = this.name,
    description = this.description,
    objective = this.objective,
    status = this.status,
    priority = this.priority,
    version = this.version,
    permissions = this.permissions,
    dependencies = this.dependencies,
    tags = this.tags,
    iconName = this.iconName,
    color = this.color,
    menuOrder = this.menuOrder,
    url = this.url,
    visibleInMenu = this.visibleInMenu,
    showInDashboard = this.showInDashboard,
    createdAt = this.createdAt,
    updatedAt = this.updatedAt
)
