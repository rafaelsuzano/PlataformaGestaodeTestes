package br.com.suzanoit.qa.modules.auth.infrastructure.security

import br.com.suzanoit.qa.modules.tenant.infrastructure.TenantContext
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date

@Service
class JwtService {
    
    // Na Fase 5 usaremos um segredo hardcoded para simplificar, 
    // mas num projeto real isso viria de variável de ambiente.
    @Value("\${jwt.secret:SuperSecretKeyQA}")
    private lateinit var secret: String

    @Value("\${jwt.expiration:86400000}")
    private var expirationMs: Long = 86400000 // 1 dia

    fun generateToken(userId: String, profile: String, tenantId: String): String {
        return JWT.create()
            .withSubject(userId)
            .withClaim("profile", profile)
            .withClaim("tenantId", tenantId)
            .withIssuedAt(Date())
            .withExpiresAt(Date(System.currentTimeMillis() + expirationMs))
            .sign(Algorithm.HMAC256(secret))
    }

    fun validateTokenAndGetClaims(token: String): Map<String, String> {
        try {
            val verifier = JWT.require(Algorithm.HMAC256(secret)).build()
            val decodedJWT = verifier.verify(token)
            
            return mapOf(
                "userId" to decodedJWT.subject,
                "profile" to decodedJWT.getClaim("profile").asString(),
                "tenantId" to decodedJWT.getClaim("tenantId").asString()
            )
        } catch (e: JWTVerificationException) {
            return emptyMap()
        }
    }
}
