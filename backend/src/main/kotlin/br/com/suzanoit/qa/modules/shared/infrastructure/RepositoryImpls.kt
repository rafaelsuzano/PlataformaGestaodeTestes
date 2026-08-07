package br.com.suzanoit.qa.modules.shared.infrastructure
import br.com.suzanoit.qa.modules.shared.domain.*

import br.com.suzanoit.qa.modules.core.domain.Category
import br.com.suzanoit.qa.modules.shared.domain.CategoryRepository
import br.com.suzanoit.qa.modules.core.domain.Defect
import br.com.suzanoit.qa.modules.shared.domain.DefectRepository
import br.com.suzanoit.qa.modules.projects.domain.Environment
import br.com.suzanoit.qa.modules.shared.domain.EnvironmentRepository
import br.com.suzanoit.qa.modules.executions.domain.ExecutionHistory
import br.com.suzanoit.qa.modules.shared.domain.ExecutionHistoryRepository
import br.com.suzanoit.qa.modules.projects.domain.Feature
import br.com.suzanoit.qa.modules.shared.domain.FeatureRepository
import br.com.suzanoit.qa.modules.core.domain.Module
import br.com.suzanoit.qa.modules.shared.domain.ModuleRepository
import br.com.suzanoit.qa.modules.projects.domain.Requirement
import br.com.suzanoit.qa.modules.shared.domain.RequirementRepository
import br.com.suzanoit.qa.modules.audit.domain.SystemLog
import br.com.suzanoit.qa.modules.shared.domain.SystemLogRepository
import br.com.suzanoit.qa.modules.core.domain.TestCase
import br.com.suzanoit.qa.modules.core.domain.TestCaseFolder
import br.com.suzanoit.qa.modules.shared.domain.TestCaseFolderRepository
import br.com.suzanoit.qa.modules.shared.domain.TestCaseRepository
import br.com.suzanoit.qa.modules.executions.domain.TestExecution
import br.com.suzanoit.qa.modules.shared.domain.TestExecutionRepository
import br.com.suzanoit.qa.modules.executions.domain.TestExecutionStep
import br.com.suzanoit.qa.modules.shared.domain.TestExecutionStepRepository
import br.com.suzanoit.qa.modules.executions.domain.TestPlan
import br.com.suzanoit.qa.modules.shared.domain.TestPlanRepository
import br.com.suzanoit.qa.modules.core.domain.TestStep
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

import br.com.suzanoit.qa.modules.projects.domain.Project
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
class ModuleRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.projects.infrastructure.jpa.ModuleJpaRepository) : ModuleRepository {
    override fun save(module: Module): Module = jpaRepository.save(br.com.suzanoit.qa.modules.projects.infrastructure.jpa.ModuleJpaEntity.fromDomain(module)).toDomain()
    override fun findById(id: String): Module? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<Module> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class CategoryRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.projects.infrastructure.jpa.CategoryJpaRepository) : CategoryRepository {
    override fun save(category: Category): Category = jpaRepository.save(br.com.suzanoit.qa.modules.projects.infrastructure.jpa.CategoryJpaEntity.fromDomain(category)).toDomain()
    override fun findById(id: String): Category? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<Category> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class RequirementRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.projects.infrastructure.jpa.RequirementJpaRepository) : RequirementRepository {
    override fun save(requirement: Requirement): Requirement = jpaRepository.save(br.com.suzanoit.qa.modules.projects.infrastructure.jpa.RequirementJpaEntity.fromDomain(requirement)).toDomain()
    override fun findById(id: String): Requirement? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<Requirement> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class FeatureRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.projects.infrastructure.jpa.FeatureJpaRepository) : FeatureRepository {
    override fun save(feature: Feature): Feature = jpaRepository.save(br.com.suzanoit.qa.modules.projects.infrastructure.jpa.FeatureJpaEntity.fromDomain(feature)).toDomain()
    override fun findById(id: String): Feature? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<Feature> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestCaseFolderRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseFolderJpaRepository) : TestCaseFolderRepository {
    override fun save(folder: TestCaseFolder): TestCaseFolder = jpaRepository.save(br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseFolderJpaEntity.fromDomain(folder)).toDomain()
    override fun findById(id: String): TestCaseFolder? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findByProjectId(projectId: String): List<TestCaseFolder> = jpaRepository.findByProjectId(projectId).map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestCaseRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseJpaRepository) : TestCaseRepository {
    override fun save(testCase: TestCase): TestCase = jpaRepository.save(br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestCaseJpaEntity.fromDomain(testCase)).toDomain()
    override fun findById(id: String): TestCase? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<TestCase> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestStepRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestStepJpaRepository) : TestStepRepository {
    override fun save(testStep: TestStep): TestStep = jpaRepository.save(br.com.suzanoit.qa.modules.core.infrastructure.jpa.TestStepJpaEntity.fromDomain(testStep)).toDomain()
    override fun findById(id: String): TestStep? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<TestStep> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestExecutionRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionJpaRepository) : TestExecutionRepository {
    override fun save(testExecution: TestExecution): TestExecution = jpaRepository.save(br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionJpaEntity.fromDomain(testExecution)).toDomain()
    override fun findById(id: String): TestExecution? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<TestExecution> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestExecutionStepRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionStepJpaRepository) : TestExecutionStepRepository {
    override fun save(testExecutionStep: TestExecutionStep): TestExecutionStep = jpaRepository.save(br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestExecutionStepJpaEntity.fromDomain(testExecutionStep)).toDomain()
    override fun findById(id: String): TestExecutionStep? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<TestExecutionStep> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class DefectRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.core.infrastructure.jpa.DefectJpaRepository) : DefectRepository {
    override fun save(defect: Defect): Defect = jpaRepository.save(br.com.suzanoit.qa.modules.core.infrastructure.jpa.DefectJpaEntity.fromDomain(defect)).toDomain()
    override fun findById(id: String): Defect? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<Defect> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestPlanRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestPlanJpaRepository) : TestPlanRepository {
    override fun save(plan: TestPlan): TestPlan = jpaRepository.save(br.com.suzanoit.qa.modules.executions.infrastructure.jpa.TestPlanJpaEntity.fromDomain(plan)).toDomain()
    override fun findById(id: String): TestPlan? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<TestPlan> = jpaRepository.findAll().map { it.toDomain() }
    override fun findByProjectId(projectId: String): List<TestPlan> = jpaRepository.findByProjectId(projectId).map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class EnvironmentRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.projects.infrastructure.jpa.EnvironmentJpaRepository) : EnvironmentRepository {
    override fun save(environment: Environment): Environment = jpaRepository.save(br.com.suzanoit.qa.modules.projects.infrastructure.jpa.EnvironmentJpaEntity.fromDomain(environment)).toDomain()
    override fun findById(id: String): Environment? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<Environment> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class ExecutionHistoryRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.executions.infrastructure.jpa.ExecutionHistoryJpaRepository) : ExecutionHistoryRepository {
    override fun save(history: ExecutionHistory): ExecutionHistory = jpaRepository.save(br.com.suzanoit.qa.modules.executions.infrastructure.jpa.ExecutionHistoryJpaEntity.fromDomain(history)).toDomain()
    override fun findById(id: String): ExecutionHistory? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<ExecutionHistory> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class SystemLogRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.modules.audit.infrastructure.jpa.SystemLogJpaRepository) : SystemLogRepository {
    override fun save(log: SystemLog): SystemLog = jpaRepository.save(br.com.suzanoit.qa.modules.audit.infrastructure.jpa.SystemLogJpaEntity.fromDomain(log)).toDomain()
    override fun findById(id: String): SystemLog? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<SystemLog> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}