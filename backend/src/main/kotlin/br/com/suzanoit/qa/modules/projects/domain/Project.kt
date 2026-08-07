package br.com.suzanoit.qa.modules.projects.domain

import java.time.LocalDateTime
import java.util.UUID

data class Project(
    val id: String = UUID.randomUUID().toString(),

    val name: String,
    val description: String?,
    val version: String?,
    val status: String,
    val managerName: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

