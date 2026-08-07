package br.com.suzanoit.qa.modules.auth.presentation

import br.com.suzanoit.qa.modules.auth.application.AuthService
import br.com.suzanoit.qa.modules.auth.application.LoginRequest
import br.com.suzanoit.qa.modules.auth.application.LoginResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        val response = authService.login(request)
        return ResponseEntity.ok(response)
    }
}
