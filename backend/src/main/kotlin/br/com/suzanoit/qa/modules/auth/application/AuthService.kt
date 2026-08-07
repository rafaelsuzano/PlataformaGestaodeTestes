package br.com.suzanoit.qa.modules.auth.application

import br.com.suzanoit.qa.modules.auth.infrastructure.security.JwtService
import br.com.suzanoit.qa.modules.users.infrastructure.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    fun login(request: LoginRequest): LoginResponse {
        val userEntity = userRepository.findByEmail(request.email)
            ?: throw br.com.suzanoit.qa.modules.shared.domain.exceptions.UnauthorizedException("Invalid credentials")

        if (!passwordEncoder.matches(request.password, userEntity.password)) {
            throw br.com.suzanoit.qa.modules.shared.domain.exceptions.UnauthorizedException("Invalid credentials")
        }

        // O tenantId está presente no UserJpaEntity
        val tenantId = userEntity.tenantId ?: throw br.com.suzanoit.qa.modules.shared.domain.exceptions.BusinessException("User has no tenant assigned")

        val token = jwtService.generateToken(
            userId = userEntity.id,
            profile = userEntity.profile,
            tenantId = tenantId
        )

        val userInfo = UserInfo(
            id = userEntity.id,
            name = userEntity.name,
            email = userEntity.email,
            profile = userEntity.profile
        )

        return LoginResponse(token, userInfo)
    }
}
