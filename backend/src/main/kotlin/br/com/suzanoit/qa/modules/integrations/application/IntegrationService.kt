package br.com.suzanoit.qa.modules.integrations.application


import br.com.suzanoit.qa.modules.shared.domain.IntegrationConfig
import br.com.suzanoit.qa.modules.integrations.infrastructure.jpa.IntegrationConfigJpaEntity
import br.com.suzanoit.qa.modules.integrations.infrastructure.IntegrationConfigRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class IntegrationService(private val repository: IntegrationConfigRepository) {

    fun getAllConfigs(): List<IntegrationConfig> {
        return repository.findAll().map { 
            IntegrationConfig(it.id, it.type, it.url, it.apiToken, it.projectId, it.createdAt, it.updatedAt)
        }
    }

    @Transactional
    fun saveConfig(config: IntegrationConfig): IntegrationConfig {
        val existing = repository.findByType(config.type)
        val entityToSave = if (existing != null) {
            existing.url = config.url
            existing.apiToken = config.apiToken
            existing.projectId = config.projectId
            existing.updatedAt = LocalDateTime.now()
            existing
        } else {
            IntegrationConfigJpaEntity(
                id = config.id,
                type = config.type,
                url = config.url,
                apiToken = config.apiToken,
                projectId = config.projectId,
                createdAt = config.createdAt,
                updatedAt = config.updatedAt
            )
        }
        val saved = repository.save(entityToSave)
        return IntegrationConfig(saved.id, saved.type, saved.url, saved.apiToken, saved.projectId, saved.createdAt, saved.updatedAt)
    }
}