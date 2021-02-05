package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDboRepository
import org.hibernate.Session
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import javax.persistence.EntityManager

// TODO: check if transaction rollback works
// TODO: check if transaction rollbacks, image is being deleted as well
// TODO: check if azure OCR returns a 500x, what is going to happen then? is an exception being thrown? or are only for 400er codes exceptions thrown?
// TODO: ask - how to get rid of entityManager.refresh(...)?
@Component
class ReceiptService (
    val ocrService: OcrService,
    val fileStorageService: FileStorageService,
    val lineDboRepository: LineDboRepository,
    val receiptDboRepository: ReceiptDboRepository,
    val uuidGenerator: UUIDGenerator,
    val entityManager: EntityManager
) {
    @Transactional
    fun initReceipt(image: ByteArray, fileExtension: String): ReceiptDbo {
        val imageUrl = uploadImageWithRandomUUIDFileName(image, fileExtension)

        val extractedText = ocrService.extractText(imageUrl)
        if (extractedText != null) {
            val receiptDbo = receiptDboRepository.save(ReceiptDbo(status = ReceiptStatus.TextExtracted, imgUrl = imageUrl, angle = extractedText.angle))
            val lineDbos = extractedText.lines.map { mapToLineDbo(it.text, it.boundingBox, receiptDbo) }
            lineDboRepository.saveAll(lineDbos)
            entityManager.refresh(receiptDbo)
            return receiptDbo
        } else {
            return receiptDboRepository.save(ReceiptDbo(status = ReceiptStatus.Uploaded, imgUrl = imageUrl, angle = null))
        }
    }

    private fun uploadImageWithRandomUUIDFileName(image: ByteArray, fileExtension: String): String {
        val uuid = uuidGenerator.generateRandomUUID()
        return fileStorageService.uploadImage(image, "$uuid.$fileExtension")
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
}