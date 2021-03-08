package ch.lucfonjallaz.drezip.bl.receipt.line

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource(exported = false)
interface LineDboRepository : JpaRepository<LineDbo, Int>