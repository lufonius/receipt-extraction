package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDboRepository
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemType
import io.mockk.InternalPlatformDsl.toArray
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.BDDAssumptions.given
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource

@ExtendWith(MockKExtension::class)
class ReceiptServiceTest {

    @MockK
    private lateinit var receiptDboRepository: ReceiptDboRepository

    @MockK
    private lateinit var receiptItemDboRepository: ReceiptItemDboRepository

    @InjectMockKs
    private lateinit var receiptService: ReceiptService

    @Test
    fun `should validate upsert for setting category on ReceiptItem if type is Category`() {
        val receiptDbo = createTestReceiptDbo(status = ReceiptStatus.InProgress)
        val lineDboWithId1 = createTestLineDbo(receiptDbo, id = 1)
        val lineDboWithId2 = createTestLineDbo(receiptDbo, id = 2)
        val dbo = createTestReceiptItemDbo(
                labelLine = lineDboWithId1,
                amountLine = lineDboWithId2,
                receiptDbo = receiptDbo,
                categoryDbo = null,
                type = ReceiptItemType.Category
        )
        val exc = assertThrows<Exception> { receiptService.upsertReceiptItem(dbo) }

        assertThat(exc.message).isEqualTo("If you specify a ReceiptItem Type of 'Category', you have to pass a category")
    }

    @Test
    fun `should validate upsert for setting amount line and label line the same`() {
        val receiptDbo = createTestReceiptDbo(status = ReceiptStatus.InProgress)
        val lineDboWithId1 = createTestLineDbo(receiptDbo, id = 1)
        val categoryDbo = createTestCategoryDbo()
        val dbo = createTestReceiptItemDbo(
                labelLine = lineDboWithId1,
                amountLine = lineDboWithId1,
                receiptDbo = receiptDbo,
                categoryDbo = categoryDbo,
                type = ReceiptItemType.Category
        )

        val exc = assertThrows<Exception> { receiptService.upsertReceiptItem(dbo) }

        assertThat(exc.message).isEqualTo("amount and label cannot be the same box on the receipt. select different lines.")
    }

    @Test
    fun `should validate that a receiptItem of type Tax has no category set`() {
        val receiptDbo = createTestReceiptDbo(status = ReceiptStatus.InProgress)
        val categoryDbo = createTestCategoryDbo()
        val lineDboWithId1 = createTestLineDbo(receiptDbo, id = 1)
        val lineDboWithId2 = createTestLineDbo(receiptDbo, id = 2)
        val dbo = createTestReceiptItemDbo(
                labelLine = lineDboWithId1,
                amountLine = lineDboWithId2,
                receiptDbo = receiptDbo,
                categoryDbo = categoryDbo,
                type = ReceiptItemType.Tax
        )
        val exc = assertThrows<Exception> { receiptService.upsertReceiptItem(dbo) }

        assertThat(exc.message).isEqualTo("If you specify a ReceiptItem Type of 'Tax', you must not pass a category")
    }

    @ParameterizedTest
    @EnumSource(mode = EnumSource.Mode.EXCLUDE, value = ReceiptStatus::class, names = ["InProgress"])
    fun `should validate that ReceiptItems should not be added when not in progress`(status: ReceiptStatus) {
        val receiptDbo = createTestReceiptDbo(status = status)
        val lineDboWithId1 = createTestLineDbo(receiptDbo, id = 1)
        val lineDboWithId2 = createTestLineDbo(receiptDbo, id = 2)
        val categoryDbo = createTestCategoryDbo()
        val dbo = createTestReceiptItemDbo(
                labelLine = lineDboWithId1,
                amountLine = lineDboWithId2,
                receiptDbo = receiptDbo,
                categoryDbo = categoryDbo,
                type = ReceiptItemType.Category
        )

        val exc = assertThrows<Exception> { receiptService.upsertReceiptItem(dbo) }

        assertThat(exc.message).isEqualTo("You can only add ReceiptItems to Receipts which have the status 'InProgress'")
    }

    @Test
    fun `should return all receipts which are not done`() {
        val allStatiExceptDone = ReceiptStatus.values().filter { it != ReceiptStatus.Done }
        val receipDbos = listOf(createTestReceiptDbo())
        every { receiptDboRepository.findByStatusInOrderByUploadedAtDesc(allStatiExceptDone) }
                .returns(receipDbos)

        val receiptsNotDone = receiptService.getReceiptsNotDone()

        assertThat(receiptsNotDone)
                .containsExactlyInAnyOrder(*receipDbos.toTypedArray())
    }
}