package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.Requirement
import br.com.suzanoit.qa.core.domain.RequirementRepository
import org.springframework.stereotype.Service

@Service
class RequirementService(private val repository: RequirementRepository) {
    fun createRequirement(requirement: Requirement): Requirement = repository.save(requirement)
    fun getRequirement(id: String): Requirement? = repository.findById(id)
    fun getAllRequirements(): List<Requirement> = repository.findAll()
    fun deleteRequirement(id: String) = repository.delete(id)
}
