package br.com.suzanoit.qa.modules.projects.domain

import java.time.LocalDateTime
import java.util.UUID

data class Feature(
    val id: String = UUID.randomUUID().toString(),
    val moduleId: String,
    val categoryId: String? = null,
    val code: String? = null,
    val name: String,
    val description: String?,
    val objective: String? = null,
    val status: String? = null,
    val priority: String? = null,
    val version: String? = null,
    val permissions: String? = null,
    val dependencies: String? = null,
    val tags: String? = null,
    val iconName: String? = null,
    val color: String? = null,
    val menuOrder: Int = 0,
    val url: String? = null,
    val visibleInMenu: Boolean = true,
    val showInDashboard: Boolean = true,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

