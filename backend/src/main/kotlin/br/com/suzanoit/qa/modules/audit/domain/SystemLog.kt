package br.com.suzanoit.qa.modules.audit.domain

import java.time.LocalDateTime
import java.util.UUID

data class SystemLog(
    val id: String = UUID.randomUUID().toString(),
    val userId: String?,
    val actionType: String,
    val module: String,
    val description: String?,
    val ipAddress: String?,
    val browser: String?,
    val result: String?,
    val createdAt: LocalDateTime = LocalDateTime.now()
)

