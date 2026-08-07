import os

path = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/api_testing/application"
os.makedirs(path, exist_ok=True)

crud_services = """package br.com.suzanoit.qa.modules.api_testing.application

import br.com.suzanoit.qa.modules.api_testing.domain.*
import br.com.suzanoit.qa.modules.api_testing.infrastructure.*
import br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ApiCollectionService(private val repository: ApiCollectionRepository) {
    fun getAllByProject(projectId: String): List<ApiCollection> {
        return repository.findByProjectId(projectId).map {
            ApiCollection(it.id, it.tenantId ?: "", it.projectId, it.parentId, it.name, it.description, it.createdAt, it.updatedAt)
        }
    }

    @Transactional
    fun create(collection: ApiCollection): ApiCollection {
        val entity = ApiCollectionJpaEntity(collection.id, collection.projectId, collection.parentId, collection.name, collection.description, collection.createdAt, collection.updatedAt)
        entity.tenantId = collection.tenantId
        val saved = repository.save(entity)
        return collection.copy(id = saved.id)
    }

    @Transactional
    fun delete(id: String) {
        repository.deleteById(id)
    }
}

@Service
class ApiEnvironmentService(private val repository: ApiEnvironmentRepository) {
    fun getAllByProject(projectId: String): List<ApiEnvironment> {
        return repository.findByProjectId(projectId).map {
            ApiEnvironment(it.id, it.tenantId ?: "", it.projectId, it.name, it.color, it.createdAt, it.updatedAt)
        }
    }

    @Transactional
    fun create(env: ApiEnvironment): ApiEnvironment {
        val entity = ApiEnvironmentJpaEntity(env.id, env.projectId, env.name, env.color, env.createdAt, env.updatedAt)
        entity.tenantId = env.tenantId
        val saved = repository.save(entity)
        return env.copy(id = saved.id)
    }

    @Transactional
    fun delete(id: String) {
        repository.deleteById(id)
    }
}

@Service
class ApiVariableService(private val repository: ApiVariableRepository) {
    fun getByScope(scope: String, scopeId: String): List<ApiVariable> {
        return repository.findByScopeAndScopeId(scope, scopeId).map {
            ApiVariable(it.id, it.tenantId ?: "", it.scope, it.scopeId, it.keyName, it.valueData, it.isSecret, it.createdAt, it.updatedAt)
        }
    }

    @Transactional
    fun create(variable: ApiVariable): ApiVariable {
        val entity = ApiVariableJpaEntity(variable.id, variable.scope, variable.scopeId, variable.keyName, variable.valueData, variable.isSecret, variable.createdAt, variable.updatedAt)
        entity.tenantId = variable.tenantId
        val saved = repository.save(entity)
        return variable.copy(id = saved.id)
    }
    
    @Transactional
    fun delete(id: String) {
        repository.deleteById(id)
    }
}

@Service
class ApiAssertionService(private val repository: ApiAssertionRepository) {
    fun getByRequestId(requestId: String): List<ApiAssertion> {
        return repository.findByRequestId(requestId).map {
            ApiAssertion(it.id, it.tenantId ?: "", it.requestId, it.source, it.propertyPath, it.operator, it.expectedValue, it.createdAt, it.updatedAt)
        }
    }

    @Transactional
    fun create(assertion: ApiAssertion): ApiAssertion {
        val entity = ApiAssertionJpaEntity(assertion.id, assertion.requestId, assertion.source, assertion.propertyPath, assertion.operator, assertion.expectedValue, assertion.createdAt, assertion.updatedAt)
        entity.tenantId = assertion.tenantId
        val saved = repository.save(entity)
        return assertion.copy(id = saved.id)
    }
    
    @Transactional
    fun delete(id: String) {
        repository.deleteById(id)
    }
}
"""

with open(os.path.join(path, "ApiServices.kt"), "w") as f:
    f.write(crud_services)

print("Created ApiServices.kt")
