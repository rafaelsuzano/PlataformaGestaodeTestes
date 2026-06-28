package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.SprintService
import br.com.suzanoit.qa.core.domain.Sprint
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/sprints")
@CrossOrigin(origins = ["*"])
class SprintController(private val service: SprintService) {

    @GetMapping
    fun getAll(): ResponseEntity<List<Sprint>> {
        return ResponseEntity.ok(service.getAllSprints())
    }

    @PostMapping
    fun create(@RequestBody sprint: Sprint): ResponseEntity<Sprint> {
        return ResponseEntity.ok(service.createSprint(sprint))
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody sprint: Sprint): ResponseEntity<Sprint> {
        val updated = service.updateSprint(id, sprint)
        return if (updated != null) ResponseEntity.ok(updated) else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String): ResponseEntity<Void> {
        service.deleteSprint(id)
        return ResponseEntity.noContent().build()
    }
}
