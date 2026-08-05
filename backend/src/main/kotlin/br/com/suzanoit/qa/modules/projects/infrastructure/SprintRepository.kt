package br.com.suzanoit.qa.modules.projects.infrastructure

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SprintRepository : JpaRepository<SprintJpaEntity, String>