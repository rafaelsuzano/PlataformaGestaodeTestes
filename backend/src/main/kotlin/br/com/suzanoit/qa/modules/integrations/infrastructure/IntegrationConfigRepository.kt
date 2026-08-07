package br.com.suzanoit.qa.modules.integrations.infrastructure

import br.com.suzanoit.qa.modules.integrations.infrastructure.jpa.IntegrationConfigJpaEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface IntegrationConfigRepository : JpaRepository<IntegrationConfigJpaEntity, String> {
    fun findByType(type: String): IntegrationConfigJpaEntity?
}