package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.User
import br.com.suzanoit.qa.infrastructure.persistence.jpa.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class UserService(
    private val userRepository: UserRepository,
    private val userProjectRepository: UserProjectRepository
) {

    @Transactional
    fun createUser(user: User): User {
        val entity = UserJpaEntity(
            id = user.id,
            name = user.name,
            email = user.email,
            password = user.password,
            profile = user.profile,
            createdAt = user.createdAt,
            updatedAt = user.updatedAt
        )
        val savedUser = userRepository.save(entity)
        
        user.projectIds.forEach { projectId ->
            userProjectRepository.save(UserProjectJpaEntity(savedUser.id, projectId))
        }

        return user
    }

    fun getAllUsers(): List<User> {
        val users = userRepository.findAll()
        return users.map { u ->
            val projectIds = userProjectRepository.findByUserId(u.id).map { it.projectId }
            User(u.id, u.name, u.email, u.password, u.profile, projectIds, u.createdAt, u.updatedAt)
        }
    }

    @Transactional
    fun updateUser(id: String, user: User): User? {
        val existing = userRepository.findById(id).orElse(null) ?: return null
        
        existing.name = user.name
        existing.email = user.email
        if (user.password.isNotEmpty()) {
            existing.password = user.password
        }
        existing.profile = user.profile
        existing.updatedAt = LocalDateTime.now()
        
        userRepository.save(existing)
        
        userProjectRepository.deleteByUserId(id)
        user.projectIds.forEach { projectId ->
            userProjectRepository.save(UserProjectJpaEntity(id, projectId))
        }
        
        return User(existing.id, existing.name, existing.email, existing.password, existing.profile, user.projectIds, existing.createdAt, existing.updatedAt)
    }

    @Transactional
    fun deleteUser(id: String) {
        userProjectRepository.deleteByUserId(id)
        userRepository.deleteById(id)
    }

    fun login(email: String, password: String): User? {
        val user = userRepository.findByEmail(email) ?: return null
        if (user.password == password) { // Simplificado para MVP (sem BCrypt)
            val projectIds = userProjectRepository.findByUserId(user.id).map { it.projectId }
            return User(user.id, user.name, user.email, "", user.profile, projectIds, user.createdAt, user.updatedAt) // Não retornar senha
        }
        return null
    }
}
