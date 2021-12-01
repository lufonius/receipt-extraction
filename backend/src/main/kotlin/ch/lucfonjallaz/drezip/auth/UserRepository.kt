package ch.lucfonjallaz.drezip.auth

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource(exported = false)
interface UserRepository  : JpaRepository<UserDbo, Int> {
    fun findByUsername(username: String): UserDbo?
}