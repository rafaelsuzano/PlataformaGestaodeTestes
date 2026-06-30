package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.infrastructure.persistence.jpa.JpaAutomatedTestResult
import br.com.suzanoit.qa.infrastructure.persistence.jpa.JpaAutomatedTestResultRepository
import br.com.suzanoit.qa.infrastructure.persistence.jpa.JpaAutomatedTestRun
import br.com.suzanoit.qa.infrastructure.persistence.jpa.JpaAutomatedTestRunRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

data class AutomationTestResultDto(
    val name: String,
    val suite: String?,
    val status: String, // PASSED, FAILED, SKIPPED
    val durationMs: Int,
    val errorMessage: String? = null,
    val stackTrace: String? = null
)

data class AutomationRunReportDto(
    val projectId: String,
    val name: String,
    val environment: String?,
    val framework: String, // e.g., "Cypress"
    val tests: List<AutomationTestResultDto>
)

data class AutomatedTestRunResponse(
    val id: String,
    val projectId: String,
    val name: String,
    val environment: String?,
    val framework: String,
    val status: String,
    val totalTests: Int,
    val passedTests: Int,
    val failedTests: Int,
    val skippedTests: Int,
    val durationMs: Int,
    val executedAt: String
)

@Service
class AutomationService(
    private val runRepository: JpaAutomatedTestRunRepository,
    private val resultRepository: JpaAutomatedTestResultRepository
) {

    @Transactional
    fun processReport(report: AutomationRunReportDto): AutomatedTestRunResponse {
        val totalTests = report.tests.size
        val passedTests = report.tests.count { it.status.uppercase() == "PASSED" }
        val failedTests = report.tests.count { it.status.uppercase() == "FAILED" }
        val skippedTests = report.tests.count { it.status.uppercase() == "SKIPPED" }
        
        val overallStatus = if (failedTests > 0) "FAILED" else "PASSED"
        val totalDurationMs = report.tests.sumOf { it.durationMs }

        val run = JpaAutomatedTestRun(
            projectId = report.projectId,
            name = report.name,
            environment = report.environment,
            framework = report.framework,
            status = overallStatus,
            totalTests = totalTests,
            passedTests = passedTests,
            failedTests = failedTests,
            skippedTests = skippedTests,
            durationMs = totalDurationMs,
            executedAt = LocalDateTime.now()
        )

        val savedRun = runRepository.save(run)

        val results = report.tests.map {
            JpaAutomatedTestResult(
                runId = savedRun.id,
                testName = it.name,
                suiteName = it.suite,
                status = it.status.uppercase(),
                durationMs = it.durationMs,
                errorMessage = it.errorMessage,
                stackTrace = it.stackTrace
            )
        }

        resultRepository.saveAll(results)

        return mapToResponse(savedRun)
    }

    fun getRunsByProject(projectId: String): List<AutomatedTestRunResponse> {
        return runRepository.findByProjectIdOrderByExecutedAtDesc(projectId)
            .map { mapToResponse(it) }
    }

    private fun mapToResponse(run: JpaAutomatedTestRun): AutomatedTestRunResponse {
        return AutomatedTestRunResponse(
            id = run.id,
            projectId = run.projectId,
            name = run.name,
            environment = run.environment,
            framework = run.framework,
            status = run.status,
            totalTests = run.totalTests,
            passedTests = run.passedTests,
            failedTests = run.failedTests,
            skippedTests = run.skippedTests,
            durationMs = run.durationMs,
            executedAt = run.executedAt.toString()
        )
    }
}
