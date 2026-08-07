package br.com.suzanoit.qa.modules.integrations.domain

import java.time.LocalDateTime
import java.util.UUID

data class IntegrationConfig(
    val id: String = UUID.randomUUID().toString(),
    val type: String, // AZURE_DEVOPS, JIRA_XRAY, JIRA_ZEPHYR
    val url: String,
    val apiToken: String,
    val projectId: String? = null,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

