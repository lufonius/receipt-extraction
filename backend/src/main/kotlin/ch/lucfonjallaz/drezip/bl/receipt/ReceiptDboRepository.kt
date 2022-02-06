package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.auth.UserDbo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource(exported = false)
interface ReceiptDboRepository : JpaRepository<ReceiptDbo, Int> {
    fun findByStatusInAndUserOrderByUploadedAtDesc(stati: List<ReceiptStatus>, userDbo: UserDbo): List<ReceiptDbo>
}