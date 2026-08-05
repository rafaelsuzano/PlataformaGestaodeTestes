package br.com.suzanoit.qa.modules.projects.infrastructure

import br.com.suzanoit.qa.modules.shared.infrastructure.jpa.SprintJpaEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SprintRepository : JpaRepository<SprintJpaEntity, String>