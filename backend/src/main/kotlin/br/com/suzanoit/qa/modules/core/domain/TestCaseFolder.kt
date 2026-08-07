package br.com.suzanoit.qa.modules.core.domain

import java.time.LocalDateTime
import java.util.UUID

data class TestCaseFolder(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val parentId: String?,
    val name: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

