package br.com.suzanoit.qa.infrastructure.persistence

import br.com.suzanoit.qa.core.domain.TenantBranding
import br.com.suzanoit.qa.core.domain.TenantBrandingRepository
import br.com.suzanoit.qa.infrastructure.persistence.jpa.TenantBrandingJpaEntity
import br.com.suzanoit.qa.infrastructure.persistence.jpa.TenantBrandingJpaRepository
import org.springframework.stereotype.Component

@Component
class TenantBrandingRepositoryImpl(
    private val jpaRepository: TenantBrandingJpaRepository
) : TenantBrandingRepository {

    override fun save(branding: TenantBranding): TenantBranding {
        val entity = TenantBrandingJpaEntity(
            id = branding.id,
            tenantId = branding.tenantId,
            companyName = branding.companyName,
            platformName = branding.platformName,
            logo = branding.logo,
            logoSmall = branding.logoSmall,
            favicon = branding.favicon,
            backgroundImage = branding.backgroundImage,
            primaryColor = branding.primaryColor,
            secondaryColor = branding.secondaryColor,
            accentColor = branding.accentColor,
            menuColor = branding.menuColor,
            headerColor = branding.headerColor,
            backgroundColor = branding.backgroundColor,
            buttonColor = branding.buttonColor,
            font = branding.font,
            theme = branding.theme,
            createdAt = branding.createdAt,
            updatedAt = branding.updatedAt
        )
        val savedEntity = jpaRepository.save(entity)
        return mapToDomain(savedEntity)
    }

    override fun findByTenantId(tenantId: String): TenantBranding? {
        val entity = jpaRepository.findByTenantId(tenantId)
        return entity?.let { mapToDomain(it) }
    }

    private fun mapToDomain(entity: TenantBrandingJpaEntity): TenantBranding {
        return TenantBranding(
            id = entity.id,
            tenantId = entity.tenantId,
            companyName = entity.companyName,
            platformName = entity.platformName,
            logo = entity.logo,
            logoSmall = entity.logoSmall,
            favicon = entity.favicon,
            backgroundImage = entity.backgroundImage,
            primaryColor = entity.primaryColor,
            secondaryColor = entity.secondaryColor,
            accentColor = entity.accentColor,
            menuColor = entity.menuColor,
            headerColor = entity.headerColor,
            backgroundColor = entity.backgroundColor,
            buttonColor = entity.buttonColor,
            font = entity.font,
            theme = entity.theme,
            createdAt = entity.createdAt,
            updatedAt = entity.updatedAt
        )
    }
}
