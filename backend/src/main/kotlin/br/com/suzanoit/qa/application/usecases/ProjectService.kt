package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.Project
import br.com.suzanoit.qa.core.domain.ProjectRepository
import org.springframework.stereotype.Service

@Service
class ProjectService(private val repository: ProjectRepository) {
    fun createProject(project: Project): Project = repository.save(project)
    fun getProject(id: String): Project? = repository.findById(id)
    fun getAllProjects(): List<Project> = repository.findAll()
    fun deleteProject(id: String) = repository.delete(id)
}
