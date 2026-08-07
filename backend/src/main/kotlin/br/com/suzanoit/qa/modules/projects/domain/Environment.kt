package br.com.suzanoit.qa.modules.projects.domain

import java.time.LocalDateTime
import java.util.UUID

data class Environment(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val description: String?,
    val baseUrl: String?,
    val type: String?,
    val status: String,
    val color: String?,
    val icon: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

