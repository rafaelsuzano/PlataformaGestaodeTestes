package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.Environment
import br.com.suzanoit.qa.core.domain.EnvironmentRepository
import org.springframework.stereotype.Service

@Service
class EnvironmentService(
    private val environmentRepository: EnvironmentRepository,
    private val systemLogService: SystemLogService
) {
    fun createEnvironment(environment: Environment, userId: String?): Environment {
        val saved = environmentRepository.save(environment)
        systemLogService.logAction(userId, "CREATE_ENVIRONMENT", "Configurações", "Ambiente ${saved.name} criado")
        return saved
    }

    fun getEnvironment(id: String): Environment? = environmentRepository.findById(id)

    fun getAllEnvironments(): List<Environment> = environmentRepository.findAll()

    fun updateEnvironment(environment: Environment, userId: String?): Environment {
        val saved = environmentRepository.save(environment)
        systemLogService.logAction(userId, "UPDATE_ENVIRONMENT", "Configurações", "Ambiente ${saved.name} atualizado")
        return saved
    }

    fun deleteEnvironment(id: String, userId: String?) {
        val env = environmentRepository.findById(id)
        environmentRepository.delete(id)
        if (env != null) {
            systemLogService.logAction(userId, "DELETE_ENVIRONMENT", "Configurações", "Ambiente ${env.name} excluído")
        }
    }
}
