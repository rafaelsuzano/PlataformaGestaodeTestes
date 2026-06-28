package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.DefectService
import br.com.suzanoit.qa.core.domain.Defect
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/defects")
@CrossOrigin(origins = ["*"])
class DefectController(private val service: DefectService) {

    @GetMapping
    fun getAll(): List<Defect> = service.getAllDefects()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: String): ResponseEntity<Defect> {
        val defect = service.getDefect(id)
        return if (defect != null) ResponseEntity.ok(defect) else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun create(@RequestBody defect: Defect): Defect = service.createDefect(defect)

    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody defect: Defect): ResponseEntity<Defect> {
        val updated = service.updateDefect(id, defect)
        return if (updated != null) ResponseEntity.ok(updated) else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String): ResponseEntity<Void> {
        service.deleteDefect(id)
        return ResponseEntity.noContent().build()
    }
}
