package br.com.suzanoit.qa.modules.tenant.infrastructure

object TenantContext {
    private val currentTenant = ThreadLocal<String>()
    
    const val DEFAULT_TENANT_ID = "default-tenant"

    fun setTenantId(tenantId: String?) {
        if (tenantId.isNullOrBlank()) {
            currentTenant.set(DEFAULT_TENANT_ID)
        } else {
            currentTenant.set(tenantId)
        }
    }

    fun getTenantId(): String {
        return currentTenant.get() ?: DEFAULT_TENANT_ID
    }

    fun clear() {
        currentTenant.remove()
    }
}
