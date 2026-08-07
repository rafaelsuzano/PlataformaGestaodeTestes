package br.com.suzanoit.qa.modules.core.domain

import java.time.LocalDateTime
import java.util.UUID

data class TestCase(
    val id: String = UUID.randomUUID().toString(),
    val featureId: String?,
    val folderId: String?, // Pasta do Test Case (Árvore por Projeto)
    val requirementId: String?, // Vínculo com Requisito (Rastreabilidade)
    val title: String,
    val description: String?,
    val type: String, // MANUAL, AUTOMATED
    val status: String, // DRAFT, REVIEW, APPROVED, DEPRECATED
    val gherkinContent: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

