package br.com.suzanoit.qa.modules.core.domain

import java.time.LocalDateTime
import java.util.UUID

data class TestStep(
    val id: String = UUID.randomUUID().toString(),
    val testCaseId: String,
    val stepNumber: Int,
    val action: String,
    val expectedResult: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

