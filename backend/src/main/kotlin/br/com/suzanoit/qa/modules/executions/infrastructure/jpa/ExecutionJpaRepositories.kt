package br.com.suzanoit.qa.modules.executions.infrastructure.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface TestExecutionJpaRepository : JpaRepository<TestExecutionJpaEntity, String>
@Repository interface TestExecutionStepJpaRepository : JpaRepository<TestExecutionStepJpaEntity, String>
@Repository interface TestPlanJpaRepository : JpaRepository<TestPlanJpaEntity, String> {
    fun findByProjectId(projectId: String): List<TestPlanJpaEntity>
}
@Repository interface ExecutionHistoryJpaRepository : JpaRepository<ExecutionHistoryJpaEntity, String>
