package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.bl.receipt.*
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDboRepository
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDboRepository
import com.azure.ai.formrecognizer.models.FormPageRange
import com.azure.ai.formrecognizer.models.RecognizedForm
import io.mockk.*
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.impl.annotations.RelaxedMockK
import io.mockk.junit5.MockKExtension
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
    private lateinit var receiptFormExtractionService: ReceiptFormExtractionService

    @MockK
    private lateinit var receiptDoMapper: ReceiptDoMapper

    @MockK
    private lateinit var uuidGenerator: UUIDGenerator

    @MockK
    private lateinit var receiptDboRepository: ReceiptDboRepository

    @MockK
    private lateinit var dateFactory: DateFactory

    // relaxed, because the save method of that repository does not return anything, so we do not have to mock it
    // only verifying that they have been called
    @RelaxedMockK
    private lateinit var receiptItemDboRepository: ReceiptItemDboRepository

    @RelaxedMockK
    private lateinit var lineDboRepository: LineDboRepository

    @RelaxedMockK
    private lateinit var entityManager: EntityManager

    @InjectMockKs
    private lateinit var initReceiptService: InitReceiptService

    @Test
    fun `should create a receipt with status UPLOADED and imageUrl after the image has been uploaded but extraction returns null`() {
        every { fileStorageService.uploadImage(image = any(), filename = "bongo.jpg") }
                .returns("https://gaggi.com/bongo.jpg")
        every { receiptFormExtractionService.extractFields(imageUrl = "https://gaggi.com/bongo.jpg") }
                .returns(null)
        every { uuidGenerator.generateRandomUUID() }
                .returns("bongo")

        val receiptDbo = ReceiptDbo(status = ReceiptStatus.Uploaded, imgUrl = "https://gaggi.com/bongo.jpg", angle = null, uploadedAt = Date())
        every { receiptDboRepository.save(and(
                match { it.status == ReceiptStatus.Uploaded },
                match { it.imgUrl == "/bongo.jpg" }
        )) }.returns(receiptDbo)

        val receipt = initReceiptService.initReceipt(ByteArray(1), "jpg")

        assertThat(receipt.imgUrl).isEqualTo("/bongo.jpg")
        assertThat(receipt.status).isEqualTo(ReceiptStatus.Uploaded)
    }

    @Test
    fun `should create a receipt with status UPLOADED and imageUrl after the image has been uploaded but extraction throws`() {
        every { fileStorageService.uploadImage(image = any(), filename = "bongo.jpg") }
                .returns("https://gaggi.com/bongo.jpg")

        every { receiptFormExtractionService.extractFields(imageUrl = "https://gaggi.com/bongo.jpg") }
                .throws(Exception())

        every { uuidGenerator.generateRandomUUID() }
                .returns("bongo")

        val receiptDbo = ReceiptDbo(status = ReceiptStatus.Uploaded, imgUrl = "https://gaggi.com/bongo.jpg", angle = null, uploadedAt = Date())
        every { receiptDboRepository.save(and(
                match { it.status == ReceiptStatus.Uploaded },
                match { it.imgUrl == "/bongo.jpg" }
        )) }.returns(receiptDbo)

        val receipt = initReceiptService.initReceipt(ByteArray(1), "jpg")

        assertThat(receipt.imgUrl).isEqualTo("/bongo.jpg")
        assertThat(receipt.status).isEqualTo(ReceiptStatus.Uploaded)
    }

    @Test
    fun `should create a receipt with status OPEN and should save the extracted text in lineDbos`() {
        // given
        every { uuidGenerator.generateRandomUUID() }.returns("bongo")

        val imageUrl = "https://gaggi.com/bongo.jpg"
        every { fileStorageService.uploadImage(image = any(), filename = "bongo.jpg") }
                .returns(imageUrl)
        val recognizedForm = RecognizedForm(emptyMap(), "", FormPageRange(1, 1), emptyList())
        every { receiptFormExtractionService.extractFields(imageUrl = imageUrl) }.returns(recognizedForm)

        val receiptDo = ReceiptDo(lines = emptyList(), items = emptyList(), date = null, total = null, merchant = null)
        every { receiptDoMapper.mapAzureFormToReceiptDo(recognizedForm) }.returns(receiptDo)

        val date = Date()
        every { dateFactory.generateCurrentDate() }.returns(date)

        val receiptDbo = createTestReceiptDbo(imgUrl = "/bongo.jpg", status = ReceiptStatus.Open)
        every { receiptDoMapper.mapDoToDbo(status = ReceiptStatus.Open, uploadedAt = date, imgUrl = "/bongo.jpg", receiptDo) }
                .returns(receiptDbo)

        every { receiptDboRepository.save(receiptDbo) }.returns(receiptDbo)

        val lineDbo = createTestLineDbo(receiptDbo)
        val lineDbos = listOf(lineDbo)
        every { receiptDoMapper.mapLineDosToLineDbos(receiptDo.lines, receiptDbo) }.returns(lineDbos)

        val receiptItemDbo = createTestReceiptItemDbo(
                labelLine = lineDbo,
                priceLine = lineDbo,
                receiptDbo = receiptDbo
        )
        val receiptItemDbos = listOf(receiptItemDbo)
        every { receiptDo.items?.let { receiptDoMapper.mapItemsDosToReceiptItemDbos(it, receiptDbo) } }
                .returns(receiptItemDbos)

        // when
        val receipt = initReceiptService.initReceipt(ByteArray(1), "jpg")

        // then
        assertThat(receipt).isEqualTo(receiptDbo)

        verify { receiptDboRepository.save(and(
                match { it.status == ReceiptStatus.Open },
                match { it.imgUrl == "/bongo.jpg" }
        )) }
        confirmVerified(receiptDboRepository)

        val lineDbosSaved = slot<List<LineDbo>>()
        verify { lineDboRepository.saveAll(capture(lineDbosSaved)) }

        assertThat(lineDbosSaved.captured)
                .usingRecursiveFieldByFieldElementComparator()
                .containsExactly(lineDbo)

        val itemDbosSaved = slot<List<ReceiptItemDbo>>()
        verify { receiptItemDboRepository.saveAll(capture(itemDbosSaved)) }

        assertThat(itemDbosSaved.captured)
                .usingRecursiveFieldByFieldElementComparator()
                .containsExactly(receiptItemDbo)
    }
}