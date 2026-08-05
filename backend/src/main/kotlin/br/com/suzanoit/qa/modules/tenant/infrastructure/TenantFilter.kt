package br.com.suzanoit.qa.modules.tenant.infrastructure

import jakarta.servlet.Filter
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class TenantFilter : Filter {

    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        val req = request as HttpServletRequest
        
        // Em Fase 5, isso será extraído do JWT. 
        // Por enquanto (Fase 4), usaremos o Header X-Tenant-ID
        val tenantId = req.getHeader("X-Tenant-ID")
        
        TenantContext.setTenantId(tenantId)
        
        try {
            chain.doFilter(request, response)
        } finally {
            TenantContext.clear()
        }
    }
}
