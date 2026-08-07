package br.com.suzanoit.qa.modules.audit.infrastructure.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface SystemLogJpaRepository : JpaRepository<SystemLogJpaEntity, String>
