package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.EnvironmentService
import br.com.suzanoit.qa.core.domain.Environment
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/environments")
@CrossOrigin(origins = ["*"])
class EnvironmentController(private val service: EnvironmentService) {

    @PostMapping
    fun create(@RequestBody environment: Environment, @RequestHeader("X-User-Id", required = false) userId: String?): ResponseEntity<Environment> {
        return ResponseEntity.ok(service.createEnvironment(environment, userId))
    }

    @GetMapping
    fun getAll(): ResponseEntity<List<Environment>> {
        return ResponseEntity.ok(service.getAllEnvironments())
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: String): ResponseEntity<Environment> {
        val env = service.getEnvironment(id)
        return if (env != null) ResponseEntity.ok(env) else ResponseEntity.notFound().build()
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody environment: Environment, @RequestHeader("X-User-Id", required = false) userId: String?): ResponseEntity<Environment> {
        return ResponseEntity.ok(service.updateEnvironment(environment.copy(id = id), userId))
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String, @RequestHeader("X-User-Id", required = false) userId: String?): ResponseEntity<Void> {
        service.deleteEnvironment(id, userId)
        return ResponseEntity.noContent().build()
    }
}
