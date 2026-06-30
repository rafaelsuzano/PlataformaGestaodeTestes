package br.com.suzanoit.qa.infrastructure.persistence.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProjectJpaRepository : JpaRepository<ProjectJpaEntity, String>

@Repository
interface ModuleJpaRepository : JpaRepository<ModuleJpaEntity, String>

@Repository
interface CategoryJpaRepository : JpaRepository<CategoryJpaEntity, String>

@Repository
interface RequirementJpaRepository : JpaRepository<RequirementJpaEntity, String>

@Repository
interface FeatureJpaRepository : JpaRepository<FeatureJpaEntity, String>

@Repository
interface TestCaseFolderJpaRepository : JpaRepository<TestCaseFolderJpaEntity, String> {
    fun findByProjectId(projectId: String): List<TestCaseFolderJpaEntity>
}

@Repository
interface TestCaseJpaRepository : JpaRepository<TestCaseJpaEntity, String>

@Repository
interface TestStepJpaRepository : JpaRepository<TestStepJpaEntity, String>

@Repository
interface TestExecutionJpaRepository : JpaRepository<TestExecutionJpaEntity, String>

@Repository
interface TestExecutionStepJpaRepository : JpaRepository<TestExecutionStepJpaEntity, String>

@Repository
interface DefectJpaRepository : JpaRepository<DefectJpaEntity, String>

@Repository
interface TestPlanJpaRepository : JpaRepository<TestPlanJpaEntity, String> {
    fun findByProjectId(projectId: String): List<TestPlanJpaEntity>
}

@Repository
interface EnvironmentJpaRepository : JpaRepository<EnvironmentJpaEntity, String>

@Repository
interface ExecutionHistoryJpaRepository : JpaRepository<ExecutionHistoryJpaEntity, String>

@Repository
interface SystemLogJpaRepository : JpaRepository<SystemLogJpaEntity, String>
