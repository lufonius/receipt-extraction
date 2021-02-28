package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDbo
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDboRepository
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptStatus
import ch.lucfonjallaz.drezip.bl.receipt.UUIDGenerator
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDboRepository
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.impl.annotations.RelaxedMockK
import io.mockk.junit5.MockKExtension
import io.mockk.slot
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.util.*
import javax.persistence.EntityManager

@ExtendWith(MockKExtension::class)
class InitReceiptServiceTest {

    @MockK
    private lateinit var fileStorageService: FileStorageService

    @MockK
    private lateinit var ocrService: OcrService

    @MockK
    private lateinit var uuidGenerator: UUIDGenerator

    @MockK
    private lateinit var receiptDboRepository: ReceiptDboRepository

    @RelaxedMockK
    private lateinit var lineDboRepository: LineDboRepository

    @RelaxedMockK
    private lateinit var entityManager: EntityManager

    @InjectMockKs
    private lateinit var initReceiptService: InitReceiptService

    @Test
    fun `should create a receipt with status UPLOADED and imageUrl after the image has been uploaded`() {
        every { fileStorageService.uploadImage(image = any(), filename = "bongo.jpg") }
                .returns("https://gaggi.com/bongo.jpg")
        every { ocrService.extractText(imageUrl = "https://gaggi.com/bongo.jpg") }.returns(null)
        every { uuidGenerator.generateRandomUUID() }.returns("bongo")

        val receiptDbo = ReceiptDbo(status = ReceiptStatus.Uploaded, imgUrl = "https://gaggi.com/bongo.jpg", angle = null, uploadedAt = Date())
        every { receiptDboRepository.save(and(
                match { it.status == ReceiptStatus.Uploaded },
                match { it.imgUrl == "https://gaggi.com/bongo.jpg" }
        )) }.returns(receiptDbo)

        val receipt = initReceiptService.initReceipt(ByteArray(1), "jpg")

        assertThat(receipt.imgUrl).isEqualTo("https://gaggi.com/bongo.jpg")
        assertThat(receipt.status).isEqualTo(ReceiptStatus.Uploaded)
    }

    @Test
    fun `should create a receipt with status TEXTEXTRACTED and should save the extracted text in lineDbos`() {
        every { fileStorageService.uploadImage(image = any(), filename = "bongo.jpg") }
                .returns("https://gaggi.com/bongo.jpg")
        every { ocrService.extractText(imageUrl = "https://gaggi.com/bongo.jpg") }.returns(
                AzureReadResultDto(
                        angle = 90.0F,
                        lines = listOf(AzureLineDto(listOf(0, 1, 2, 3, 4, 5, 6, 7), "extracted text"))
                )
        )
        every { uuidGenerator.generateRandomUUID() }.returns("bongo")
        val receiptDbo = ReceiptDbo(
                id = 9,
                status = ReceiptStatus.Open,
                imgUrl = "https://gaggi.com/bongo.jpg",
                angle = 90.0F,
                uploadedAt = Date()
        )
        every { receiptDboRepository.save(any()) }.returns(receiptDbo)

        val receiptDboWithLines = receiptDbo.copy(lines = listOf(LineDbo(
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
        )))
        every { receiptDboRepository.getOne(9) }.returns(receiptDboWithLines)

        val receipt = initReceiptService.initReceipt(ByteArray(1), "jpg")

        assertThat(receipt.imgUrl).isEqualTo("https://gaggi.com/bongo.jpg")
        assertThat(receipt.status).isEqualTo(ReceiptStatus.Open)
        //assertThat()

        verify { receiptDboRepository.save(and(
                match { it.status == ReceiptStatus.Open },
                match { it.imgUrl == "https://gaggi.com/bongo.jpg" }
        )) }

        val lineDbosSaved = slot<List<LineDbo>>()
        verify { lineDboRepository.saveAll(capture(lineDbosSaved)) }

        assertThat(lineDbosSaved.captured)
                .usingRecursiveFieldByFieldElementComparator()
                .containsExactly(
                        LineDbo(
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
                )
    }
}