package br.com.suzanoit.qa.modules.projects.infrastructure.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface ProjectJpaRepository : JpaRepository<ProjectJpaEntity, String>
@Repository interface ModuleJpaRepository : JpaRepository<ModuleJpaEntity, String>
@Repository interface CategoryJpaRepository : JpaRepository<CategoryJpaEntity, String>
@Repository interface RequirementJpaRepository : JpaRepository<RequirementJpaEntity, String>
@Repository interface FeatureJpaRepository : JpaRepository<FeatureJpaEntity, String>
@Repository interface EnvironmentJpaRepository : JpaRepository<EnvironmentJpaEntity, String>
@Repository interface SprintJpaRepository : JpaRepository<SprintJpaEntity, String>
