package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDto
import ch.lucfonjallaz.drezip.bl.receipt.line.PointDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class ReceiptDtoTest {
    @Test
    fun `should map a receiptDbo to a receiptDto`() {
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

        val actualReceiptDbo = ReceiptDto.fromDbo(receiptDboWithLines)

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

        assertThat(actualReceiptDbo)
                .usingRecursiveComparison()
                .isEqualTo(expectedReceiptDto)
    }
}