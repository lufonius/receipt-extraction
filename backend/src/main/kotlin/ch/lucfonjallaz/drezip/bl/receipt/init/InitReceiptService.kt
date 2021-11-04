package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.bl.receipt.*
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDboRepository
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDboRepository
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
        val entityManager: EntityManager
) {

    fun initReceipt(image: ByteArray, fileExtension: String): ReceiptDbo {
        val uuid = uuidGenerator.generateRandomUUID()
        val fullImageUrl = fileStorageService.uploadImage(image, "$uuid.$fileExtension")
        val relativeImageUrl = URL(fullImageUrl).path

        val form = receiptFormExtractionService.extractFields(fullImageUrl)
        if (form !== null) {
            val receiptDo = receiptDoMapper.mapAzureFormToReceiptDo(form)

            val receiptDbo = receiptDoMapper.mapDoToDbo(ReceiptStatus.Open, Date(), relativeImageUrl, receiptDo)
            receiptDboRepository.save(receiptDbo)

            val lineDbos = receiptDoMapper.mapLineDosToLineDbos(receiptDo.lines, receiptDbo)
            lineDboRepository.saveAll(lineDbos)

            val itemsDbos = receiptDoMapper.mapItemsDosToReceiptItemDbos(receiptDo.items.orEmpty(), receiptDbo)
            receiptItemDboRepository.saveAll(itemsDbos)

            entityManager.refresh(receiptDbo)
            return receiptDbo
        } else {
            val receiptDbo = ReceiptDbo(
                    status = ReceiptStatus.Open,
                    uploadedAt = Date(),
                    imgUrl = relativeImageUrl
            )
            receiptDboRepository.save(receiptDbo)
            return receiptDbo
        }
    }
}