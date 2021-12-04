package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.auth.UserDbo
import ch.lucfonjallaz.drezip.bl.receipt.*
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDboRepository
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDboRepository
import com.azure.ai.formrecognizer.models.RecognizedForm
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.net.URL
import java.util.*
import javax.persistence.EntityManager

// TODO: check if transaction rollback works
// TODO: check if transaction rollbacks, image is being deleted as well
// TODO: check if azure OCR returns a 500x, what is going to happen then? is an exception being thrown? or are only for 400er codes exceptions thrown?
// TODO: ask - how to get rid of entityManager.refresh(...)?
// TODO: make cascadeType.persist on receiptdbo, then we do not need the lineRepository and the entityManager :)
@Component
@Transactional
class InitReceiptService (
        val receiptFormExtractionService: ReceiptFormExtractionService,
        val receiptDoMapper: ReceiptDoMapper,
        val fileStorageService: FileStorageService,
        val lineDboRepository: LineDboRepository,
        val receiptDboRepository: ReceiptDboRepository,
        val receiptItemDboRepository: ReceiptItemDboRepository,
        val uuidGenerator: UUIDGenerator,
        val entityManager: EntityManager,
        val dateFactory: DateFactory
) {

    private val logger = LoggerFactory.getLogger(InitReceiptService::class.java)

    fun initReceipt(image: ByteArray, fileExtension: String, userDbo: UserDbo): ReceiptDbo {
        val uuid = uuidGenerator.generateRandomUUID()
        val fullImageUrl = fileStorageService.uploadImage(image, "$uuid.$fileExtension")
        val relativeImageUrl = URL(fullImageUrl).path

        var form: RecognizedForm?
        try {
            form = receiptFormExtractionService.extractFields(fullImageUrl)
        } catch(exception: Exception) {
            val receiptDbo = createAndSaveEmptyInitialReceiptDbo(relativeImageUrl, userDbo)
            val id = receiptDbo.id
            val message = exception.message
            logger.error("Extraction of forms of receipt with id $id failed! \n $message")
            return receiptDbo
        }

        if (form !== null) {
            val receiptDo = receiptDoMapper.mapAzureFormToReceiptDo(form)
            val receiptDbo = receiptDoMapper.mapDoToDbo(
                    ReceiptStatus.Open,
                    dateFactory.generateCurrentDate(),
                    relativeImageUrl,
                    receiptDo,
                    userDbo
            )
            receiptDboRepository.save(receiptDbo)

            val lineDbos = receiptDoMapper.mapLineDosToLineDbos(receiptDo.lines, receiptDbo, userDbo)
            lineDboRepository.saveAll(lineDbos)

            val itemsDbos = receiptDoMapper.mapItemsDosToReceiptItemDbos(receiptDo.items.orEmpty(), receiptDbo, userDbo)
            receiptItemDboRepository.saveAll(itemsDbos)

            entityManager.refresh(receiptDbo)
            return receiptDbo
        } else {
            return createAndSaveEmptyInitialReceiptDbo(relativeImageUrl, userDbo)
        }
    }

    private fun createAndSaveEmptyInitialReceiptDbo(relativeImageUrl: String, userDbo: UserDbo): ReceiptDbo {
        val receiptDbo = ReceiptDbo(
                status = ReceiptStatus.Uploaded,
                uploadedAt = Date(),
                imgUrl = relativeImageUrl,
                user = entityManager.getReference(UserDbo::class.java, userDbo)
        )
        receiptDboRepository.save(receiptDbo)
        return receiptDbo
    }
}