package br.com.suzanoit.qa.modules.core.domain

import java.time.LocalDateTime
import java.util.UUID

data class Module(
    val id: String = UUID.randomUUID().toString(),
    val projectId: String = "GLOBAL",
    val name: String,
    val description: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

