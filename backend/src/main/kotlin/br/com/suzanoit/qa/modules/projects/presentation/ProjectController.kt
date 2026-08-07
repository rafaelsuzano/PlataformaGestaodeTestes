package br.com.suzanoit.qa.modules.projects.presentation


import br.com.suzanoit.qa.modules.projects.application.ProjectService
import br.com.suzanoit.qa.modules.projects.presentation.dto.CreateProjectRequest
import br.com.suzanoit.qa.modules.projects.presentation.dto.ProjectResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/projects")
@CrossOrigin(origins = ["*"])
class ProjectController(private val projectService: ProjectService) {

    @GetMapping
    fun getAllProjects(): ResponseEntity<List<ProjectResponse>> {
        return ResponseEntity.ok(projectService.getAllProjects())
    }

    @GetMapping("/{id}")
    fun getProject(@PathVariable id: String): ResponseEntity<ProjectResponse> {
        return ResponseEntity.ok(projectService.getProject(id))
    }

    @PostMapping
    fun createProject(@RequestBody request: CreateProjectRequest): ResponseEntity<ProjectResponse> {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request))
    }

    @DeleteMapping("/{id}")
    fun deleteProject(@PathVariable id: String): ResponseEntity<Void> {
        projectService.deleteProject(id)
        return ResponseEntity.noContent().build()
    }
}