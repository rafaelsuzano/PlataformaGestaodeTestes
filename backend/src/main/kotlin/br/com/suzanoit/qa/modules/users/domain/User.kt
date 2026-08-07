package br.com.suzanoit.qa.modules.users.domain

import java.time.LocalDateTime
import java.util.UUID

data class User(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val email: String,
    val password: String, // Em produção usaria BCrypt
    val profile: String, // ADMIN, QA, DEV, PO
    val projectIds: List<String> = emptyList(),
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

