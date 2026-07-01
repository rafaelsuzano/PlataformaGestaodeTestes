package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.core.domain.Category
import br.com.suzanoit.qa.core.domain.CategoryRepository
import br.com.suzanoit.qa.core.domain.Module
import br.com.suzanoit.qa.core.domain.ModuleRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = ["*"])
class PlatformSettingsController(
    private val moduleRepository: ModuleRepository,
    private val categoryRepository: CategoryRepository
) {

    // --- Modules ---
    @GetMapping("/modules")
    fun getAllModules(): List<Module> = moduleRepository.findAll()

    @GetMapping("/modules/{id}")
    fun getModule(@PathVariable id: String): ResponseEntity<Module> {
        val module = moduleRepository.findById(id)
        return if (module != null) ResponseEntity.ok(module) else ResponseEntity.notFound().build()
    }

    @PostMapping("/modules")
    fun createModule(@RequestBody module: Module): Module = moduleRepository.save(module)

    @DeleteMapping("/modules/{id}")
    fun deleteModule(@PathVariable id: String): ResponseEntity<Void> {
        moduleRepository.delete(id)
        return ResponseEntity.noContent().build()
    }

    // --- Categories ---
    @GetMapping("/categories")
    fun getAllCategories(): List<Category> = categoryRepository.findAll()

    @GetMapping("/categories/{id}")
    fun getCategory(@PathVariable id: String): ResponseEntity<Category> {
        val category = categoryRepository.findById(id)
        return if (category != null) ResponseEntity.ok(category) else ResponseEntity.notFound().build()
    }

    @PostMapping("/categories")
    fun createCategory(@RequestBody category: Category): Category = categoryRepository.save(category)

    @DeleteMapping("/categories/{id}")
    fun deleteCategory(@PathVariable id: String): ResponseEntity<Void> {
        categoryRepository.delete(id)
        return ResponseEntity.noContent().build()
    }
}
