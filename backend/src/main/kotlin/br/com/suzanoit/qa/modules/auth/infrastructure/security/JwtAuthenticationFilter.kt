package br.com.suzanoit.qa.modules.auth.infrastructure.security

import br.com.suzanoit.qa.modules.tenant.infrastructure.TenantContext
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(private val jwtService: JwtService) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val token = authHeader.substring(7)
        val claims = jwtService.validateTokenAndGetClaims(token)

        if (claims.isNotEmpty() && SecurityContextHolder.getContext().authentication == null) {
            val userId = claims["userId"]
            val profile = claims["profile"] ?: "USER"
            val tenantId = claims["tenantId"]

            if (userId != null && tenantId != null) {
                // Injeta o tenant context diretamente a partir do JWT validado
                TenantContext.setTenantId(tenantId)

                val authorities = listOf(SimpleGrantedAuthority("ROLE_$profile"))
                val authToken = UsernamePasswordAuthenticationToken(userId, null, authorities)
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)

                SecurityContextHolder.getContext().authentication = authToken
            }
        }

        try {
            filterChain.doFilter(request, response)
        } finally {
            // Limpa o TenantContext para evitar vazamentos entre requisições
            TenantContext.clear()
        }
    }
}
