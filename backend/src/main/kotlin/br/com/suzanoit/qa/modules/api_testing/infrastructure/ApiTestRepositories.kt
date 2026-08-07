package br.com.suzanoit.qa.modules.api_testing.infrastructure

import br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiTestExecutionJpaEntity
import br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiTestPlanJpaEntity
import br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiTestRequestJpaEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ApiTestPlanRepository : JpaRepository<ApiTestPlanJpaEntity, String>

@Repository
interface ApiTestRequestRepository : JpaRepository<ApiTestRequestJpaEntity, String> {
    fun findByPlanId(planId: String): List<ApiTestRequestJpaEntity>
    fun findByCollectionId(collectionId: String): List<ApiTestRequestJpaEntity>
}

@Repository
interface ApiTestExecutionRepository : JpaRepository<ApiTestExecutionJpaEntity, String> {
    fun findTop5ByOrderByCreatedAtDesc(): List<ApiTestExecutionJpaEntity>
}

@Repository
interface ApiCollectionRepository : JpaRepository<br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiCollectionJpaEntity, String> {
    fun findByProjectId(projectId: String): List<br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiCollectionJpaEntity>
}

@Repository
interface ApiEnvironmentRepository : JpaRepository<br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiEnvironmentJpaEntity, String> {
    fun findByProjectId(projectId: String): List<br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiEnvironmentJpaEntity>
}

@Repository
interface ApiVariableRepository : JpaRepository<br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiVariableJpaEntity, String> {
    fun findByScopeAndScopeId(scope: String, scopeId: String): List<br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiVariableJpaEntity>
}

@Repository
interface ApiAssertionRepository : JpaRepository<br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiAssertionJpaEntity, String> {
    fun findByRequestId(requestId: String): List<br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiAssertionJpaEntity>
}

@Repository
interface ApiExecutionResultRepository : JpaRepository<br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiExecutionResultJpaEntity, String> {
    fun findByExecutionId(executionId: String): List<br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.ApiExecutionResultJpaEntity>
}