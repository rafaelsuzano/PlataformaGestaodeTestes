package br.com.suzanoit.qa.modules.projects.domain

import java.time.LocalDateTime
import java.util.UUID

data class Sprint(
    val id: String? = null,
    val projectId: String,
    val name: String,
    val goal: String? = null,
    val startDate: LocalDateTime? = null,
    val endDate: LocalDateTime? = null,
    val status: String,
    val createdAt: LocalDateTime? = null,
    val updatedAt: LocalDateTime? = null
)

