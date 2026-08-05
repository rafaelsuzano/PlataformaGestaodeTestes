package br.com.suzanoit.qa.modules.users.infrastructure

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<UserJpaEntity, String> {
    fun findByEmail(email: String): UserJpaEntity?
}

@Repository
interface UserProjectRepository : JpaRepository<UserProjectJpaEntity, UserProjectId> {
    fun findByUserId(userId: String): List<UserProjectJpaEntity>
    fun deleteByUserId(userId: String)
}