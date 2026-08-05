package br.com.suzanoit.qa.modules.audit.presentation

import br.com.suzanoit.qa.modules.audit.application.SystemLogService
import br.com.suzanoit.qa.modules.shared.domain.SystemLog
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/system-logs")
@CrossOrigin(origins = ["*"])
class SystemLogController(private val service: SystemLogService) {

    @GetMapping
    fun getAll(): ResponseEntity<List<SystemLog>> {
        return ResponseEntity.ok(service.getAllLogs())
    }
}