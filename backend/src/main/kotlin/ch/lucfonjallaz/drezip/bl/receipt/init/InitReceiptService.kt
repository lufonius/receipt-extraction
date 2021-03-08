package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.bl.receipt.*
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDboRepository
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemType
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDboRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
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
        val ocrService: OcrService,
        val fileStorageService: FileStorageService,
        val lineDboRepository: LineDboRepository,
        val receiptDboRepository: ReceiptDboRepository,
        val receiptItemDboRepository: ReceiptItemDboRepository,
        val uuidGenerator: UUIDGenerator,
        val entityManager: EntityManager
) {

    fun initReceipt(image: ByteArray, fileExtension: String): ReceiptDbo {
        val uuid = uuidGenerator.generateRandomUUID()
        val imageUrl = fileStorageService.uploadImage(image, "$uuid.$fileExtension")

        val extractedText = ocrService.extractText(imageUrl)
        if (extractedText != null) {
            val receiptDbo = receiptDboRepository.save(ReceiptDbo(
                    status = ReceiptStatus.Open,
                    imgUrl = imageUrl,
                    angle = extractedText.angle,
                    uploadedAt = Date()
            ))
            val lineDbos = extractedText.lines.map { mapToLineDbo(it.text, it.boundingBox, receiptDbo) }
            lineDboRepository.saveAll(lineDbos)
            createInitialReceiptItems(receiptDbo)

            entityManager.refresh(receiptDbo)
            return receiptDbo
        } else {
            val receiptDbo = receiptDboRepository.save(ReceiptDbo(
                    status = ReceiptStatus.Uploaded,
                    imgUrl = imageUrl,
                    uploadedAt = Date()
            ))

            createInitialReceiptItems(receiptDbo)

            entityManager.refresh(receiptDbo)
            return receiptDbo
        }
    }

    private fun mapToLineDbo(text: String, boundingBox: List<Int>, receipt: ReceiptDbo) = LineDbo(
            topLeftX = boundingBox[0],
            topLeftY = boundingBox[1],
            topRightX = boundingBox[2],
            topRightY = boundingBox[3],
            bottomRightX = boundingBox[4],
            bottomRightY = boundingBox[5],
            bottomLeftX = boundingBox[6],
            bottomLeftY = boundingBox[7],
            text = text,
            receipt = receipt
    )

    private fun createInitialReceiptItems(receiptDbo: ReceiptDbo) {
        val totalReceiptItemDbo = ReceiptItemDbo(type = ReceiptItemType.Total, receipt = receiptDbo)
        val dateReceiptItemDbo = ReceiptItemDbo(type = ReceiptItemType.Date, receipt = receiptDbo)

        receiptItemDboRepository.saveAll(listOf(totalReceiptItemDbo, dateReceiptItemDbo))
    }
}