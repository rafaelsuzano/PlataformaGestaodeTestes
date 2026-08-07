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
}

@Repository
interface ApiTestExecutionRepository : JpaRepository<ApiTestExecutionJpaEntity, String> {
    fun findTop5ByOrderByCreatedAtDesc(): List<ApiTestExecutionJpaEntity>
}