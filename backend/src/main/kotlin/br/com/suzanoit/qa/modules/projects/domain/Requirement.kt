package br.com.suzanoit.qa.modules.projects.domain

import java.time.LocalDateTime
import java.util.UUID

data class Requirement(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String,
    val code: String,
    val title: String,
    val description: String?,
    val source: String?,
    val priority: String,
    val criticality: String,
    val sprint: String?,
    val releaseVersion: String?,
    val status: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

