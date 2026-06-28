package br.com.suzanoit.qa.infrastructure.persistence

import br.com.suzanoit.qa.core.domain.Client
import br.com.suzanoit.qa.core.domain.ClientRepository
import br.com.suzanoit.qa.core.domain.Project
import br.com.suzanoit.qa.core.domain.ProjectRepository
import br.com.suzanoit.qa.infrastructure.persistence.jpa.ClientJpaRepository
import br.com.suzanoit.qa.infrastructure.persistence.jpa.ProjectJpaRepository
import br.com.suzanoit.qa.infrastructure.persistence.jpa.ClientJpaEntity
import br.com.suzanoit.qa.infrastructure.persistence.jpa.ProjectJpaEntity
import org.springframework.stereotype.Component

@Component
class ClientRepositoryImpl(private val jpaRepository: ClientJpaRepository) : ClientRepository {
    override fun save(client: Client): Client = jpaRepository.save(ClientJpaEntity.fromDomain(client)).toDomain()
    override fun findById(id: String): Client? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<Client> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class ProjectRepositoryImpl(private val jpaRepository: ProjectJpaRepository) : ProjectRepository {
    override fun save(project: Project): Project = jpaRepository.save(ProjectJpaEntity.fromDomain(project)).toDomain()
    override fun findById(id: String): Project? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<Project> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class ModuleRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.infrastructure.persistence.jpa.ModuleJpaRepository) : br.com.suzanoit.qa.core.domain.ModuleRepository {
    override fun save(module: br.com.suzanoit.qa.core.domain.Module): br.com.suzanoit.qa.core.domain.Module = jpaRepository.save(br.com.suzanoit.qa.infrastructure.persistence.jpa.ModuleJpaEntity.fromDomain(module)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.core.domain.Module? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.core.domain.Module> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class CategoryRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.infrastructure.persistence.jpa.CategoryJpaRepository) : br.com.suzanoit.qa.core.domain.CategoryRepository {
    override fun save(category: br.com.suzanoit.qa.core.domain.Category): br.com.suzanoit.qa.core.domain.Category = jpaRepository.save(br.com.suzanoit.qa.infrastructure.persistence.jpa.CategoryJpaEntity.fromDomain(category)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.core.domain.Category? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.core.domain.Category> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class RequirementRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.infrastructure.persistence.jpa.RequirementJpaRepository) : br.com.suzanoit.qa.core.domain.RequirementRepository {
    override fun save(requirement: br.com.suzanoit.qa.core.domain.Requirement): br.com.suzanoit.qa.core.domain.Requirement = jpaRepository.save(br.com.suzanoit.qa.infrastructure.persistence.jpa.RequirementJpaEntity.fromDomain(requirement)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.core.domain.Requirement? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.core.domain.Requirement> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class FeatureRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.infrastructure.persistence.jpa.FeatureJpaRepository) : br.com.suzanoit.qa.core.domain.FeatureRepository {
    override fun save(feature: br.com.suzanoit.qa.core.domain.Feature): br.com.suzanoit.qa.core.domain.Feature = jpaRepository.save(br.com.suzanoit.qa.infrastructure.persistence.jpa.FeatureJpaEntity.fromDomain(feature)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.core.domain.Feature? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.core.domain.Feature> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestCaseFolderRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.infrastructure.persistence.jpa.TestCaseFolderJpaRepository) : br.com.suzanoit.qa.core.domain.TestCaseFolderRepository {
    override fun save(folder: br.com.suzanoit.qa.core.domain.TestCaseFolder): br.com.suzanoit.qa.core.domain.TestCaseFolder = jpaRepository.save(br.com.suzanoit.qa.infrastructure.persistence.jpa.TestCaseFolderJpaEntity.fromDomain(folder)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.core.domain.TestCaseFolder? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findByProjectId(projectId: String): List<br.com.suzanoit.qa.core.domain.TestCaseFolder> = jpaRepository.findByProjectId(projectId).map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestCaseRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.infrastructure.persistence.jpa.TestCaseJpaRepository) : br.com.suzanoit.qa.core.domain.TestCaseRepository {
    override fun save(testCase: br.com.suzanoit.qa.core.domain.TestCase): br.com.suzanoit.qa.core.domain.TestCase = jpaRepository.save(br.com.suzanoit.qa.infrastructure.persistence.jpa.TestCaseJpaEntity.fromDomain(testCase)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.core.domain.TestCase? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.core.domain.TestCase> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestStepRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.infrastructure.persistence.jpa.TestStepJpaRepository) : br.com.suzanoit.qa.core.domain.TestStepRepository {
    override fun save(testStep: br.com.suzanoit.qa.core.domain.TestStep): br.com.suzanoit.qa.core.domain.TestStep = jpaRepository.save(br.com.suzanoit.qa.infrastructure.persistence.jpa.TestStepJpaEntity.fromDomain(testStep)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.core.domain.TestStep? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.core.domain.TestStep> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestExecutionRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.infrastructure.persistence.jpa.TestExecutionJpaRepository) : br.com.suzanoit.qa.core.domain.TestExecutionRepository {
    override fun save(testExecution: br.com.suzanoit.qa.core.domain.TestExecution): br.com.suzanoit.qa.core.domain.TestExecution = jpaRepository.save(br.com.suzanoit.qa.infrastructure.persistence.jpa.TestExecutionJpaEntity.fromDomain(testExecution)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.core.domain.TestExecution? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.core.domain.TestExecution> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class TestExecutionStepRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.infrastructure.persistence.jpa.TestExecutionStepJpaRepository) : br.com.suzanoit.qa.core.domain.TestExecutionStepRepository {
    override fun save(testExecutionStep: br.com.suzanoit.qa.core.domain.TestExecutionStep): br.com.suzanoit.qa.core.domain.TestExecutionStep = jpaRepository.save(br.com.suzanoit.qa.infrastructure.persistence.jpa.TestExecutionStepJpaEntity.fromDomain(testExecutionStep)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.core.domain.TestExecutionStep? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.core.domain.TestExecutionStep> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}

@Component
class DefectRepositoryImpl(private val jpaRepository: br.com.suzanoit.qa.infrastructure.persistence.jpa.DefectJpaRepository) : br.com.suzanoit.qa.core.domain.DefectRepository {
    override fun save(defect: br.com.suzanoit.qa.core.domain.Defect): br.com.suzanoit.qa.core.domain.Defect = jpaRepository.save(br.com.suzanoit.qa.infrastructure.persistence.jpa.DefectJpaEntity.fromDomain(defect)).toDomain()
    override fun findById(id: String): br.com.suzanoit.qa.core.domain.Defect? = jpaRepository.findById(id).orElse(null)?.toDomain()
    override fun findAll(): List<br.com.suzanoit.qa.core.domain.Defect> = jpaRepository.findAll().map { it.toDomain() }
    override fun delete(id: String) = jpaRepository.deleteById(id)
}
