package br.com.suzanoit.qa.modules.executions.presentation

import br.com.suzanoit.qa.modules.executions.application.ExecutionHistoryService
import br.com.suzanoit.qa.modules.shared.domain.ExecutionHistory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/execution-history")
@CrossOrigin(origins = ["*"])
class ExecutionHistoryController(private val service: ExecutionHistoryService) {

    @PostMapping
    fun create(@RequestBody history: ExecutionHistory, @RequestHeader("X-User-Id", required = false) userId: String?): ResponseEntity<ExecutionHistory> {
        return ResponseEntity.ok(service.createExecutionHistory(history, userId))
    }

    @GetMapping
    fun getAll(): ResponseEntity<List<ExecutionHistory>> {
        return ResponseEntity.ok(service.getAllHistory())
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: String): ResponseEntity<ExecutionHistory> {
        val hist = service.getHistory(id)
        return if (hist != null) ResponseEntity.ok(hist) else ResponseEntity.notFound().build()
    }
}