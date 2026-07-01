package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.AiService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = ["*"])
class AiController(private val aiService: AiService) {

    @PostMapping("/generate-bdd")
    fun generateBdd(@RequestBody payload: Map<String, String>): ResponseEntity<Map<String, String>> {
        val context = payload["context"] ?: return ResponseEntity.badRequest().build()
        val result = aiService.generateBdd(context)
        return ResponseEntity.ok(result)
    }

    @PostMapping("/generate-playwright")
    fun generatePlaywright(@RequestBody payload: Map<String, String>): ResponseEntity<Map<String, String>> {
        val gherkin = payload["gherkin"] ?: return ResponseEntity.badRequest().build()
        val result = aiService.generatePlaywrightCode(gherkin)
        return ResponseEntity.ok(result)
    }
}
