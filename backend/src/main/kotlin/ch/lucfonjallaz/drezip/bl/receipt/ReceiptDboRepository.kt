package ch.lucfonjallaz.drezip.bl.receipt

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource(exported = false)
interface ReceiptDboRepository : JpaRepository<ReceiptDbo, Int> {
    fun findByStatusInOrderByUploadedAtDesc(stati: List<ReceiptStatus>): List<ReceiptDbo>
}