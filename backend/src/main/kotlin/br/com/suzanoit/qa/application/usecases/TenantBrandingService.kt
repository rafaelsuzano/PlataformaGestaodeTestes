package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.TenantBranding
import br.com.suzanoit.qa.core.domain.TenantBrandingRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID

@Service
class TenantBrandingService(
    private val repository: TenantBrandingRepository
) {
    fun getBranding(tenantId: String): TenantBranding {
        return repository.findByTenantId(tenantId) ?: createDefaultBranding(tenantId)
    }

    fun updateBranding(tenantId: String, updatedBranding: TenantBranding): TenantBranding {
        val existing = repository.findByTenantId(tenantId)
        val brandingToSave = if (existing != null) {
            existing.copy(
                companyName = updatedBranding.companyName,
                platformName = updatedBranding.platformName,
                logo = updatedBranding.logo,
                logoSmall = updatedBranding.logoSmall,
                favicon = updatedBranding.favicon,
                backgroundImage = updatedBranding.backgroundImage,
                primaryColor = updatedBranding.primaryColor,
                secondaryColor = updatedBranding.secondaryColor,
                accentColor = updatedBranding.accentColor,
                menuColor = updatedBranding.menuColor,
                headerColor = updatedBranding.headerColor,
                backgroundColor = updatedBranding.backgroundColor,
                buttonColor = updatedBranding.buttonColor,
                font = updatedBranding.font,
                theme = updatedBranding.theme,
                updatedAt = LocalDateTime.now()
            )
        } else {
            updatedBranding.copy(
                id = UUID.randomUUID().toString(),
                tenantId = tenantId,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        }
        return repository.save(brandingToSave)
    }

    private fun createDefaultBranding(tenantId: String): TenantBranding {
        return TenantBranding(
            id = UUID.randomUUID().toString(),
            tenantId = tenantId,
            companyName = "SuzanoIT QA",
            platformName = "Gestão de Testes",
            logo = null,
            logoSmall = null,
            favicon = null,
            backgroundImage = null,
            primaryColor = "#6366f1", // default indigo
            secondaryColor = "#ec4899", // default pink
            accentColor = null,
            menuColor = null,
            headerColor = null,
            backgroundColor = "#0B0F19", // default space blue
            buttonColor = null,
            font = "\"Inter\", \"Outfit\", \"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            theme = "dark"
        )
    }
}
