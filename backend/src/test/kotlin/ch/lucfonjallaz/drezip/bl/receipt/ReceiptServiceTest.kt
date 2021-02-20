package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDboRepository
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemType
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith

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
        val receiptDbo = createTestReceiptDbo(status = ReceiptStatus.Open)
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
        val receiptDbo = createTestReceiptDbo(status = ReceiptStatus.Open)
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
}