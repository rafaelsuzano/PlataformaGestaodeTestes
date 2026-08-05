package br.com.suzanoit.qa.modules.tenant.infrastructure

import org.hibernate.context.spi.CurrentTenantIdentifierResolver
import org.springframework.stereotype.Component

@Component
class CurrentTenantIdentifierResolverImpl : CurrentTenantIdentifierResolver<String> {

    override fun resolveCurrentTenantIdentifier(): String {
        return TenantContext.getTenantId()
    }

    override fun validateExistingCurrentSessions(): Boolean {
        return true
    }
}
