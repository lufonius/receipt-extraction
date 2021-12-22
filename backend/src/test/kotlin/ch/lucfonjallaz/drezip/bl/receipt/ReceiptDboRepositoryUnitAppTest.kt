package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.BaseAppTest
import ch.lucfonjallaz.drezip.auth.UserDbo
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptStatus.*
import ch.lucfonjallaz.drezip.util.UUIDForTestGenerator
import org.assertj.core.api.Assertions.assertThat
import org.springframework.beans.factory.annotation.Autowired
import javax.persistence.EntityManager
import org.junit.jupiter.api.Test
import javax.transaction.Transactional

@Transactional
class ReceiptDboRepositoryUnitAppTest : BaseAppTest() {
    @Autowired
    private lateinit var receiptDboRepository: ReceiptDboRepository

    @Autowired
    private lateinit var entityManager: EntityManager

    @Test
    fun `should find receipts with status`() {
        val userDbo = UserDbo(username = UUIDForTestGenerator.generateRandomUUID(), password = "password")
        val openReceiptDbo = createTestReceiptDbo(status = Open, user = userDbo)
        val uploadedReceiptDbo = createTestReceiptDbo(status = Uploaded, user = userDbo)
        val doneReceiptDbo = createTestReceiptDbo(status = Done, user = userDbo)
        entityManager.persist(userDbo)
        entityManager.persist(openReceiptDbo)
        entityManager.persist(uploadedReceiptDbo)
        entityManager.persist(doneReceiptDbo)


        val foundReceipts = receiptDboRepository.findByStatusInOrderByUploadedAtDesc(listOf(Open, Uploaded))

        assertThat(foundReceipts.map { it.status }.distinct())
                .containsOnly(Open, Uploaded)

        assertThat(foundReceipts)
                .contains(openReceiptDbo, uploadedReceiptDbo)

        assertThat(foundReceipts)
                .doesNotContain(doneReceiptDbo)
    }
}