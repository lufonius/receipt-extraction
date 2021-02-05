package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDto
import ch.lucfonjallaz.drezip.bl.receipt.line.PointDto
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.mock.web.MockMultipartFile

@ExtendWith(MockKExtension::class)
internal class ReceiptControllerTest {
    @MockK
    private lateinit var receiptService: ReceiptService

    @InjectMockKs
    private lateinit var receiptController: ReceiptController

    @Test
    fun `should return the newly created dbo mapped as a dto for a given image as input`() {
        val fileContents = ByteArray(0)
        val multipartFile = MockMultipartFile("test.jpg", "hello/world/test.jpg", "image/jpg", fileContents)

        val receiptDbo = ReceiptDbo(
                id = 9,
                angle = 0.0F,
                imgUrl = "helloworld.jpg",
                lines = listOf(),
                status = ReceiptStatus.Uploaded
        )

        val lineDbo = LineDbo(
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
                receipt = receiptDbo
        )

        val receiptDboWithLines = receiptDbo.copy(lines = listOf(lineDbo))

        every { receiptService.initReceipt(fileContents, "jpg") }.returns(receiptDboWithLines)

        val result = receiptController.initReceipt(multipartFile)

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
                        text = "extracted text"
                ))
        )

        assertThat(result)
                .usingRecursiveComparison()
                .isEqualTo(expectedReceiptDto)
    }
}