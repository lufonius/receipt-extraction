package ch.lucfonjallaz.drezip.bl.receipt.item

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource(exported = false)
interface ReceiptItemDboRepository : JpaRepository<ReceiptItemDbo, Int>