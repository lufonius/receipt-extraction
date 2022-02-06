package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.init.InitReceiptService
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemMapper
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDto
import ch.lucfonjallaz.drezip.bl.receipt.line.PointDto
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.mock.web.MockMultipartFile
import java.util.*

@ExtendWith(MockKExtension::class)
internal class ReceiptControllerTest {
    @MockK
    private lateinit var initReceiptService: InitReceiptService

    @MockK
    private lateinit var receiptService: ReceiptService

    @MockK
    private lateinit var receiptMapper: ReceiptMapper

    @MockK
    private lateinit var receiptItemMapper: ReceiptItemMapper

    @InjectMockKs
    private lateinit var receiptController: ReceiptController

    @Test
    fun `should return the newly created dbo mapped as a dto for a given image as input`() {
        // given
        val user = createTestUserDbo()

        val fileContents = ByteArray(0)
        val multipartFile = MockMultipartFile("test.jpg", "hello/world/test.jpg", "image/jpg", fileContents)

        val currentDate = Date()
        val receiptDbo = createTestReceiptDbo(
                imgUrl = "helloworld.jpg",
                status = ReceiptStatus.Uploaded,
                angle = 0.0F,
                id = 9,
                uploadedAt = currentDate,
                user = user
        )

        val lineDbo = createTestLineDbo(
                id = 10,
                topLeftX = 0,
                topLeftY = 1,
                topRightX = 2,
                topRightY = 3,
                bottomRightX = 4,
                bottomRightY = 5,
                bottomLeftX = 6,
                bottomLeftY = 7,
                text = "extracted text",
                receiptDbo = receiptDbo
        )

        val receiptDboWithLines = receiptDbo.copy(lines = listOf(lineDbo))

        every { initReceiptService.initReceipt(fileContents, "jpg", user) }.returns(receiptDboWithLines)

        val expectedReceiptDto = ReceiptDto(
                id = 9,
                angle = 0.0F,
                imgUrl = "helloworld.jpg",
                status = ReceiptStatus.Uploaded,
                lines = listOf(LineDto(
                        id = 10,
                        topLeft = PointDto(0, 1),
                        topRight = PointDto(2, 3),
                        bottomRight = PointDto(4, 5),
                        bottomLeft = PointDto(6, 7),
                        text = "extracted text",
                        receiptId = receiptDbo.id
                )),
                uploadedAt = currentDate
        )

        every { receiptMapper.dtoFromDbo(receiptDboWithLines) }.returns(expectedReceiptDto)

        // when
        val result = receiptController.initReceipt(multipartFile, user)

        // then
        assertThat(result)
                .usingRecursiveComparison()
                .isEqualTo(expectedReceiptDto)
    }

    @Test
    fun `shoud return all receipts not done`() {
        val receiptDbo = createTestReceiptDbo(id = 9, status = ReceiptStatus.Uploaded)
        val receiptDbos = listOf(receiptDbo)
        val userDbo = createTestUserDbo()
        every { receiptService.getReceiptsNotDone(userDbo) }
                .returns(receiptDbos)

        val receiptListElementDtos = receiptController.getReceiptsNotDone(userDbo)

        val expectedDto = ReceiptListElementDto(
                id = 9,
                status = ReceiptStatus.Uploaded
        )
        assertThat(receiptListElementDtos)
                .usingRecursiveFieldByFieldElementComparator()
                .containsExactlyInAnyOrder(expectedDto)
    }
}