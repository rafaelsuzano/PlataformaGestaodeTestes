package br.com.suzanoit.qa.modules.projects.application
import br.com.suzanoit.qa.modules.shared.domain.*


import br.com.suzanoit.qa.modules.projects.domain.Requirement
import org.springframework.stereotype.Service

@Service
class RequirementService(private val repository: RequirementRepository) {
    fun createRequirement(requirement: Requirement): Requirement = repository.save(requirement)
    fun getRequirement(id: String): Requirement? = repository.findById(id)
    fun getAllRequirements(): List<Requirement> = repository.findAll()
    fun deleteRequirement(id: String) = repository.delete(id)
}