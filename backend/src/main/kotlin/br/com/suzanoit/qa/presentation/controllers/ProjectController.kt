package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.ProjectService
import br.com.suzanoit.qa.core.domain.Project
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = ["*"])
class ProjectController(private val projectService: ProjectService) {

    @GetMapping
    fun getAllProjects(): List<Project> = projectService.getAllProjects()

    @GetMapping("/{id}")
    fun getProject(@PathVariable id: String): ResponseEntity<Project> {
        val project = projectService.getProject(id)
        return if (project != null) ResponseEntity.ok(project) else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createProject(@RequestBody project: Project): Project = projectService.createProject(project)

    @DeleteMapping("/{id}")
    fun deleteProject(@PathVariable id: String): ResponseEntity<Void> {
        projectService.deleteProject(id)
        return ResponseEntity.noContent().build()
    }
}
