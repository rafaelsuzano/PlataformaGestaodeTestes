package br.com.suzanoit.qa.modules.tenant.infrastructure

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TenantBrandingJpaRepository : JpaRepository<TenantBrandingJpaEntity, String> {
    fun findByTenantId(tenantId: String): TenantBrandingJpaEntity?
}