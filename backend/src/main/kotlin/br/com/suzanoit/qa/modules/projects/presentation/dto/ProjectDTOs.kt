package br.com.suzanoit.qa.modules.projects.presentation.dto

import java.time.LocalDateTime

data class CreateProjectRequest(
    val name: String,
    val description: String?,
    val version: String?,
    val status: String,
    val managerName: String?
)

data class UpdateProjectRequest(
    val name: String?,
    val description: String?,
    val version: String?,
    val status: String?,
    val managerName: String?
)

data class ProjectResponse(
    val id: String,
    val name: String,
    val description: String?,
    val version: String?,
    val status: String,
    val managerName: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

fun CreateProjectRequest.toDomain() = br.com.suzanoit.qa.modules.shared.domain.Project(
    name = this.name,
    description = this.description,
    version = this.version,
    status = this.status,
    managerName = this.managerName
)

fun br.com.suzanoit.qa.modules.shared.domain.Project.toResponse() = ProjectResponse(
    id = this.id,
    name = this.name,
    description = this.description,
    version = this.version,
    status = this.status,
    managerName = this.managerName,
    createdAt = this.createdAt,
    updatedAt = this.updatedAt
)
