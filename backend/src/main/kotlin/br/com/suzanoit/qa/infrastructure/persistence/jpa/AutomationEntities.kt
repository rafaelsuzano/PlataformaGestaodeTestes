package br.com.suzanoit.qa.infrastructure.persistence.jpa

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "automated_test_runs")
class JpaAutomatedTestRun(
    @Id
    val id: String = UUID.randomUUID().toString(),
    
    @Column(name = "project_id", nullable = false)
    val projectId: String,
    
    @Column(nullable = false)
    val name: String,
    
    val environment: String?,
    
    @Column(nullable = false)
    val framework: String,
    
    @Column(nullable = false)
    val status: String,
    
    @Column(name = "total_tests", nullable = false)
    val totalTests: Int,
    
    @Column(name = "passed_tests", nullable = false)
    val passedTests: Int,
    
    @Column(name = "failed_tests", nullable = false)
    val failedTests: Int,
    
    @Column(name = "skipped_tests", nullable = false)
    val skippedTests: Int,
    
    @Column(name = "duration_ms", nullable = false)
    val durationMs: Int,
    
    @Column(name = "executed_at", nullable = false)
    val executedAt: LocalDateTime,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
)

@Entity
@Table(name = "automated_test_results")
class JpaAutomatedTestResult(
    @Id
    val id: String = UUID.randomUUID().toString(),
    
    @Column(name = "run_id", nullable = false)
    val runId: String,
    
    @Column(name = "test_name", nullable = false)
    val testName: String,
    
    @Column(name = "suite_name")
    val suiteName: String?,
    
    @Column(nullable = false)
    val status: String,
    
    @Column(name = "duration_ms", nullable = false)
    val durationMs: Int,
    
    @Column(name = "error_message")
    val errorMessage: String?,
    
    @Column(name = "stack_trace")
    val stackTrace: String?,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
)
