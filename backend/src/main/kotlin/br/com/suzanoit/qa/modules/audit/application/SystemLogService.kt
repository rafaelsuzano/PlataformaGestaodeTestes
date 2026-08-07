package br.com.suzanoit.qa.modules.audit.application
import br.com.suzanoit.qa.modules.shared.domain.*


import br.com.suzanoit.qa.modules.audit.domain.SystemLog
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class SystemLogService(
    private val systemLogRepository: SystemLogRepository
) {
    fun logAction(userId: String?, actionType: String, module: String, description: String?, ipAddress: String? = null, browser: String? = null, result: String? = "SUCCESS") {
        val log = SystemLog(
            userId = userId,
            actionType = actionType,
            module = module,
            description = description,
            ipAddress = ipAddress,
            browser = browser,
            result = result
        )
        systemLogRepository.save(log)
    }

    fun getAllLogs(): List<SystemLog> = systemLogRepository.findAll().sortedByDescending { it.createdAt }
}