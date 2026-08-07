package br.com.suzanoit.qa.modules.shared.infrastructure

import br.com.suzanoit.qa.modules.shared.domain.Category
import br.com.suzanoit.qa.modules.shared.domain.CategoryRepository
import br.com.suzanoit.qa.modules.shared.domain.Defect
import br.com.suzanoit.qa.modules.shared.domain.DefectRepository
import br.com.suzanoit.qa.modules.shared.domain.Environment
import br.com.suzanoit.qa.modules.shared.domain.EnvironmentRepository
import br.com.suzanoit.qa.modules.shared.domain.ExecutionHistory
import br.com.suzanoit.qa.modules.shared.domain.ExecutionHistoryRepository
import br.com.suzanoit.qa.modules.shared.domain.Feature
import br.com.suzanoit.qa.modules.shared.domain.FeatureRepository
import br.com.suzanoit.qa.modules.shared.domain.Module
import br.com.suzanoit.qa.modules.shared.domain.ModuleRepository
import br.com.suzanoit.qa.modules.shared.domain.Requirement
import br.com.suzanoit.qa.modules.shared.domain.RequirementRepository
import br.com.suzanoit.qa.modules.shared.domain.SystemLog
import br.com.suzanoit.qa.modules.shared.domain.SystemLogRepository
import br.com.suzanoit.qa.modules.shared.domain.TestCase
import br.com.suzanoit.qa.modules.shared.domain.TestCaseFolder
import br.com.suzanoit.qa.modules.shared.domain.TestCaseFolderRepository
import br.com.suzanoit.qa.modules.shared.domain.TestCaseRepository
import br.com.suzanoit.qa.modules.shared.domain.TestExecution
import br.com.suzanoit.qa.modules.shared.domain.TestExecutionRepository
import br.com.suzanoit.qa.modules.shared.domain.TestExecutionStep
import br.com.suzanoit.qa.modules.shared.domain.TestExecutionStepRepository
import br.com.suzanoit.qa.modules.shared.domain.TestPlan
import br.com.suzanoit.qa.modules.shared.domain.TestPlanRepository
import br.com.suzanoit.qa.modules.shared.domain.TestStep
import br.com.suzanoit.qa.modules.shared.domain.TestStepRepository
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.CategoryJpaEntity
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.CategoryJpaRepository
import br.com.suzanoit.qa.modules.core.infrastructure.jpa.DefectJpaEntity
import br.com.suzanoit.qa.modules.core.infrastructure.jpa.DefectJpaRepository
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.EnvironmentJpaEntity
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.EnvironmentJpaRepository
import br.com.suzanoit.qa.modules.executions.infrastructure.jpa.ExecutionHistoryJpaEntity
import br.com.suzanoit.qa.modules.executions.infrastructure.jpa.ExecutionHistoryJpaRepository
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.FeatureJpaEntity
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.FeatureJpaRepository
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.ModuleJpaEntity
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.ModuleJpaRepository
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.RequirementJpaEntity
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.RequirementJpaRepository
import br.com.suzanoit.qa.modules.audit.infrastructure.jpa.SystemLogJpaEntity
import br.com.suzanoit.qa.modules.audit.infrastructure.jpa.SystemLogJpaRepository
import br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseFolderJpaEntity
import br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseFolderJpaRepository
import br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseJpaEntity
import br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseJpaRepository
import br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionJpaEntity
import br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionJpaRepository
import br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionStepJpaEntity
import br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionStepJpaRepository
import br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestPlanJpaEntity
import br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestPlanJpaRepository
import br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestStepJpaEntity
import br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestStepJpaRepository

import br.com.suzanoit.qa.modules.shared.domain.Project
import br.com.suzanoit.qa.modules.shared.domain.ProjectRepository
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.ProjectJpaEntity
import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.ProjectJpaRepository
import org.springframework.stereotype.Component

@Component
class ProjectRepositoryImpl(private val jpaRepository: ProjectJpaRepository) : ProjectRepository {
    override fun save(project: Project): Project = jpaRepository.save(ProjectJpaEntity.fromDomain(project)).toDomain()
    override fun findById(id: String): Project? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<Project> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class ModuleRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.projects.infrastructure.jpa.ModuleJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.ModuleRepository {
    override fun save(module: br.com.suzanoit.qa.modules.shared.domain.Module): br.com.suzanoit.qa.modules.shared.domain.Module = jpaRepository.save(br.com.suzanoit.qa.modules.projects.infrastructure.jpa.ModuleJpaEntity.fromDomain(module)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.Module? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.Module> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class CategoryRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.projects.infrastructure.jpa.CategoryJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.CategoryRepository {
    override fun save(category: br.com.suzanoit.qa.modules.shared.domain.Category): br.com.suzanoit.qa.modules.shared.domain.Category = jpaRepository.save(br.com.suzanoit.qa.modules.projects.infrastructure.jpa.CategoryJpaEntity.fromDomain(category)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.Category? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.Category> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class RequirementRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.projects.infrastructure.jpa.RequirementJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.RequirementRepository {
    override fun save(requirement: br.com.suzanoit.qa.modules.shared.domain.Requirement): br.com.suzanoit.qa.modules.shared.domain.Requirement = jpaRepository.save(br.com.suzanoit.qa.modules.projects.infrastructure.jpa.RequirementJpaEntity.fromDomain(requirement)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.Requirement? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.Requirement> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class FeatureRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.projects.infrastructure.jpa.FeatureJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.FeatureRepository {
    override fun save(feature: br.com.suzanoit.qa.modules.shared.domain.Feature): br.com.suzanoit.qa.modules.shared.domain.Feature = jpaRepository.save(br.com.suzanoit.qa.modules.projects.infrastructure.jpa.FeatureJpaEntity.fromDomain(feature)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.Feature? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.Feature> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestCaseFolderRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseFolderJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.TestCaseFolderRepository {
    override fun save(folder: br.com.suzanoit.qa.modules.shared.domain.TestCaseFolder): br.com.suzanoit.qa.modules.shared.domain.TestCaseFolder = jpaRepository.save(br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseFolderJpaEntity.fromDomain(folder)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.TestCaseFolder? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findByProjectId(projectId: String): List<br.com.suzanoit.qa.modules.shared.domain.TestCaseFolder> = jpaRepository.findByProjectId(projectId).map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestCaseRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.TestCaseRepository {
    override fun save(testCase: br.com.suzanoit.qa.modules.shared.domain.TestCase): br.com.suzanoit.qa.modules.shared.domain.TestCase = jpaRepository.save(br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseJpaEntity.fromDomain(testCase)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.TestCase? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.TestCase> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestStepRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestStepJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.TestStepRepository {
    override fun save(testStep: br.com.suzanoit.qa.modules.shared.domain.TestStep): br.com.suzanoit.qa.modules.shared.domain.TestStep = jpaRepository.save(br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestStepJpaEntity.fromDomain(testStep)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.TestStep? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.TestStep> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestExecutionRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.TestExecutionRepository {
    override fun save(testExecution: br.com.suzanoit.qa.modules.shared.domain.TestExecution): br.com.suzanoit.qa.modules.shared.domain.TestExecution = jpaRepository.save(br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionJpaEntity.fromDomain(testExecution)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.TestExecution? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.TestExecution> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestExecutionStepRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionStepJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.TestExecutionStepRepository {
    override fun save(testExecutionStep: br.com.suzanoit.qa.modules.shared.domain.TestExecutionStep): br.com.suzanoit.qa.modules.shared.domain.TestExecutionStep = jpaRepository.save(br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionStepJpaEntity.fromDomain(testExecutionStep)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.TestExecutionStep? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.TestExecutionStep> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class DefectRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.core.infrastructure.jpa.DefectJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.DefectRepository {
    override fun save(defect: br.com.suzanoit.qa.modules.shared.domain.Defect): br.com.suzanoit.qa.modules.shared.domain.Defect = jpaRepository.save(br.com.suzanoit.qa.modules.core.infrastructure.jpa.DefectJpaEntity.fromDomain(defect)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.Defect? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.Defect> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestPlanRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestPlanJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.TestPlanRepository {
    override fun save(plan: br.com.suzanoit.qa.modules.shared.domain.TestPlan): br.com.suzanoit.qa.modules.shared.domain.TestPlan = jpaRepository.save(br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestPlanJpaEntity.fromDomain(plan)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.TestPlan? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.TestPlan> = jpaRepository.findAll().map { it.toDomain() }
    override fun findByProjectId(projectId: String): List<br.com.suzanoit.qa.modules.shared.domain.TestPlan> = jpaRepository.findByProjectId(projectId).map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class EnvironmentRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.projects.infrastructure.jpa.EnvironmentJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.EnvironmentRepository {
    override fun save(environment: br.com.suzanoit.qa.modules.shared.domain.Environment): br.com.suzanoit.qa.modules.shared.domain.Environment = jpaRepository.save(br.com.suzanoit.qa.modules.projects.infrastructure.jpa.EnvironmentJpaEntity.fromDomain(environment)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.Environment? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.Environment> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class ExecutionHistoryRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.executions.infrastructure.jpa.ExecutionHistoryJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.ExecutionHistoryRepository {
    override fun save(history: br.com.suzanoit.qa.modules.shared.domain.ExecutionHistory): br.com.suzanoit.qa.modules.shared.domain.ExecutionHistory = jpaRepository.save(br.com.suzanoit.qa.modules.executions.infrastructure.jpa.ExecutionHistoryJpaEntity.fromDomain(history)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.ExecutionHistory? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.ExecutionHistory> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class SystemLogRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.audit.infrastructure.jpa.SystemLogJpaRepository) : br.com.suzanoit.qa.modules.shared.domain.SystemLogRepository {
    override fun save(log: br.com.suzanoit.qa.modules.shared.domain.SystemLog): br.com.suzanoit.qa.modules.shared.domain.SystemLog = jpaRepository.save(br.com.suzanoit.qa.modules.audit.infrastructure.jpa.SystemLogJpaEntity.fromDomain(log)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.modules.shared.domain.SystemLog? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.modules.shared.domain.SystemLog> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}