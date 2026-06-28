package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.TestCaseFolderService
import br.com.suzanoit.qa.core.domain.TestCaseFolder
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/test-case-folders")
@CrossOrigin(origins = ["*"])
class TestCaseFolderController(private val service: TestCaseFolderService) {

    @PostMapping
    fun create(@RequestBody folder: TestCaseFolder): ResponseEntity<TestCaseFolder> {
        val newFolder = if (folder.id.isBlank()) folder.copy(id = UUID.randomUUID().toString()) else folder
        return ResponseEntity.ok(service.createFolder(newFolder))
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody folder: TestCaseFolder): ResponseEntity<TestCaseFolder> {
        return ResponseEntity.ok(service.updateFolder(folder.copy(id = id)))
    }

    @GetMapping("/project/{projectId}")
    fun getByProject(@PathVariable projectId: String): ResponseEntity<List<TestCaseFolder>> {
        return ResponseEntity.ok(service.getFoldersByProject(projectId))
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String): ResponseEntity<Void> {
        service.deleteFolder(id)
        return ResponseEntity.noContent().build()
    }
}
