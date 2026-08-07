package br.com.suzanoit.qa.modules.auth.application
import br.com.suzanoit.qa.modules.shared.domain.*

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: UserInfo
)

data class UserInfo(
    val id: String,
    val name: String,
    val email: String,
    val profile: String
)
