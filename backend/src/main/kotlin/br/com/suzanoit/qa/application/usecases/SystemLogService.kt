package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.SystemLog
import br.com.suzanoit.qa.core.domain.SystemLogRepository
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
