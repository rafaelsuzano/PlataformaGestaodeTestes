package br.com.suzanoit.qa.modules.core.presentation.dto

import java.time.LocalDateTime

data class CreateTestCaseRequest(
    val featureId: String?,
    val folderId: String?,
    val requirementId: String?,
    val title: String,
    val description: String?,
    val type: String,
    val status: String,
    val gherkinContent: String?
)

data class UpdateTestCaseRequest(
    val featureId: String?,
    val folderId: String?,
    val requirementId: String?,
    val title: String?,
    val description: String?,
    val type: String?,
    val status: String?,
    val gherkinContent: String?
)

data class TestCaseResponse(
    val id: String,
    val featureId: String?,
    val folderId: String?,
    val requirementId: String?,
    val title: String,
    val description: String?,
    val type: String,
    val status: String,
    val gherkinContent: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

fun CreateTestCaseRequest.toDomain() = br.com.suzanoit.qa.modules.shared.domain.TestCase(
    featureId = this.featureId,
    folderId = this.folderId,
    requirementId = this.requirementId,
    title = this.title,
    description = this.description,
    type = this.type,
    status = this.status,
    gherkinContent = this.gherkinContent
)

fun br.com.suzanoit.qa.modules.shared.domain.TestCase.toResponse() = TestCaseResponse(
    id = this.id,
    featureId = this.featureId,
    folderId = this.folderId,
    requirementId = this.requirementId,
    title = this.title,
    description = this.description,
    type = this.type,
    status = this.status,
    gherkinContent = this.gherkinContent,
    createdAt = this.createdAt,
    updatedAt = this.updatedAt
)
