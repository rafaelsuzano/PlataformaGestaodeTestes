package br.com.suzanoit.qa.modules.core.infrastructure.jpa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface TestCaseFolderJpaRepository : JpaRepository<TestCaseFolderJpaEntity, String> {
    fun findByProjectId(projectId: String): List<TestCaseFolderJpaEntity>
}
@Repository interface TestCaseJpaRepository : JpaRepository<TestCaseJpaEntity, String>
@Repository interface TestStepJpaRepository : JpaRepository<TestStepJpaEntity, String>
@Repository interface DefectJpaRepository : JpaRepository<DefectJpaEntity, String>
