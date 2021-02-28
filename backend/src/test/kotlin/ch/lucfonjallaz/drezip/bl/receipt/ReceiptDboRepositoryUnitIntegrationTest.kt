package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.BaseIntegrationTest
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptStatus.*
import org.assertj.core.api.Assertions.assertThat
import org.springframework.beans.factory.annotation.Autowired
import javax.persistence.EntityManager
import org.junit.jupiter.api.Test
import javax.transaction.Transactional

class ReceiptDboRepositoryUnitIntegrationTest  : BaseIntegrationTest() {
    @Autowired
    private lateinit var receiptDboRepository: ReceiptDboRepository

    @Autowired
    private lateinit var entityManager: EntityManager

    @Test
    @Transactional
    fun `should find receipts with status`() {
        val openReceiptDbo = createTestReceiptDbo(status = Open)
        val uploadedReceiptDbo = createTestReceiptDbo(status = Uploaded)
        val doneReceiptDbo = createTestReceiptDbo(status = Done)
        entityManager.persist(openReceiptDbo)
        entityManager.persist(uploadedReceiptDbo)
        entityManager.persist(doneReceiptDbo)

        val foundReceipts = receiptDboRepository.findByStatusInOrderByUploadedAtDesc(listOf(Open, Uploaded))

        assertThat(foundReceipts.map { it.status })
                .containsExactlyInAnyOrder(Open, Uploaded)
    }
}