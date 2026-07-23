package br.com.suzanoit.qa.infrastructure.persistence.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TenantBrandingJpaRepository : JpaRepository<TenantBrandingJpaEntity, String> {
    fun findByTenantId(tenantId: String): TenantBrandingJpaEntity?
}
