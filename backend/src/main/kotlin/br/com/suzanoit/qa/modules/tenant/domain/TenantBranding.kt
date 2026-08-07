package br.com.suzanoit.qa.modules.tenant.domain

import java.time.LocalDateTime
import java.util.UUID

data class TenantBranding(
    val id: String = UUID.randomUUID().toString(),
    val tenantId: String,
    val companyName: String?,
    val platformName: String?,
    val logo: String?,
    val logoSmall: String?,
    val favicon: String?,
    val backgroundImage: String?,
    val primaryColor: String?,
    val secondaryColor: String?,
    val accentColor: String?,
    val menuColor: String?,
    val headerColor: String?,
    val backgroundColor: String?,
    val buttonColor: String?,
    val font: String?,
    val theme: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)