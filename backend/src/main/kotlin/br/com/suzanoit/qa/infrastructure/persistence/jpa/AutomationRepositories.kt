package br.com.suzanoit.qa.infrastructure.persistence.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface JpaAutomatedTestRunRepository : JpaRepository<JpaAutomatedTestRun, String> {
    fun findByProjectIdOrderByExecutedAtDesc(projectId: String): List<JpaAutomatedTestRun>
}

@Repository
interface JpaAutomatedTestResultRepository : JpaRepository<JpaAutomatedTestResult, String> {
    fun findByRunId(runId: String): List<JpaAutomatedTestResult>
}
