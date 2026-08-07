package br.com.suzanoit.qa.modules.projects.application


import br.com.suzanoit.qa.modules.projects.presentation.dto.*
import br.com.suzanoit.qa.modules.shared.domain.Project
import br.com.suzanoit.qa.modules.shared.domain.ProjectRepository
import br.com.suzanoit.qa.modules.shared.domain.exceptions.ResourceNotFoundException
import org.springframework.stereotype.Service

@Service
class ProjectService(private val repository: ProjectRepository) {
    
    fun createProject(request: CreateProjectRequest): ProjectResponse {
        val project = repository.save(request.toDomain())
        return project.toResponse()
    }
    
    fun getProject(id: String): ProjectResponse {
        val project = repository.findById(id) 
            ?: throw ResourceNotFoundException("Project", "id", id)
        return project.toResponse()
    }
    
    fun getAllProjects(): List<ProjectResponse> {
        return repository.findAll().map { it.toResponse() }
    }
    
    fun deleteProject(id: String) {
        // Verifica se existe antes de deletar
        repository.findById(id) ?: throw ResourceNotFoundException("Project", "id", id)
        repository.delete(id)
    }
}