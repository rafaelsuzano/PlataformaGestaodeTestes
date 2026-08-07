package br.com.suzanoit.qa.modules.auth.application

import br.com.suzanoit.qa.modules.auth.infrastructure.security.JwtService
import br.com.suzanoit.qa.modules.auth.presentation.dto.LoginRequest
import br.com.suzanoit.qa.modules.shared.domain.exceptions.InvalidCredentialsException
import br.com.suzanoit.qa.modules.users.domain.User
import br.com.suzanoit.qa.modules.shared.domain.UserRepository
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.security.crypto.password.PasswordEncoder
import kotlin.test.assertEquals

class AuthServiceTest {

    private val userRepository: UserRepository = mockk()
    private val passwordEncoder: PasswordEncoder = mockk()
    private val jwtService: JwtService = mockk()

    private val authService = AuthService(userRepository, passwordEncoder, jwtService)

    @Test
    fun `should login successfully with valid credentials`() {
        // Arrange
        val request = LoginRequest("test@suzano.com", "password")
        val user = User(
            name = "Test User",
            email = "test@suzano.com",
            password = "encodedPassword",
            profile = "QA"
        )
        user.tenantId = "tenant1"
        
        every { userRepository.findByEmail(request.email) } returns user
        every { passwordEncoder.matches(request.password, user.password) } returns true
        every { jwtService.generateToken(user.id.toString(), user.profile, user.tenantId) } returns "jwt-token"

        // Act
        val response = authService.login(request)

        // Assert
        assertEquals("jwt-token", response.token)
        assertEquals(user.name, response.user.name)
        assertEquals(user.email, response.user.email)
    }

    @Test
    fun `should throw InvalidCredentialsException when user not found`() {
        // Arrange
        val request = LoginRequest("nonexistent@suzano.com", "password")
        every { userRepository.findByEmail(request.email) } returns null

        // Act & Assert
        assertThrows<InvalidCredentialsException> {
            authService.login(request)
        }
    }

    @Test
    fun `should throw InvalidCredentialsException when password does not match`() {
        // Arrange
        val request = LoginRequest("test@suzano.com", "wrongpassword")
        val user = User(
            name = "Test User",
            email = "test@suzano.com",
            password = "encodedPassword",
            profile = "QA"
        )
        
        every { userRepository.findByEmail(request.email) } returns user
        every { passwordEncoder.matches(request.password, user.password) } returns false

        // Act & Assert
        assertThrows<InvalidCredentialsException> {
            authService.login(request)
        }
    }
}
