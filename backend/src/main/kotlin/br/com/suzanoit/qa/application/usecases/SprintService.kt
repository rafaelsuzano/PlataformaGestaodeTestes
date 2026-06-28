package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.Sprint
import br.com.suzanoit.qa.infrastructure.persistence.jpa.SprintJpaEntity
import br.com.suzanoit.qa.infrastructure.persistence.jpa.SprintRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class SprintService(private val repository: SprintRepository) {

    fun createSprint(sprint: Sprint): Sprint {
        val entity = SprintJpaEntity.fromDomain(sprint)
        return repository.save(entity).toDomain()
    }

    fun getAllSprints(): List<Sprint> {
        return repository.findAll().map { it.toDomain() }
    }

    fun updateSprint(id: String, sprint: Sprint): Sprint? {
        val existing = repository.findById(id).orElse(null) ?: return null
        
        existing.projectId = sprint.projectId
        existing.name = sprint.name
        existing.goal = sprint.goal
        existing.startDate = sprint.startDate
        existing.endDate = sprint.endDate
        existing.status = sprint.status
        existing.updatedAt = LocalDateTime.now()
        
        return repository.save(existing).toDomain()
    }

    fun deleteSprint(id: String) {
        repository.deleteById(id)
    }
}
