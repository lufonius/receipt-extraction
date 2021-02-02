package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDboRepository
import org.springframework.stereotype.Component
import java.util.*

@Component
class ReceiptService (
    val ocrService: OcrService,
    val fileStorageService: FileStorageService,
    val lineDboRepository: LineDboRepository,
    val receiptDboRepository: ReceiptDboRepository
) {
    fun initReceipt(image: ByteArray, fileExtension: String): ReceiptDbo {
        val receiptDbo = uploadImageAndInitReceiptDbo(image, fileExtension)
        val updatedReceiptDboAfterTextExtraction = extractTextAndUpdateReceiptDbo(receiptDbo)

        return receiptDboRepository.getOne(updatedReceiptDboAfterTextExtraction.id)
    }

    private fun uploadImageAndInitReceiptDbo(image: ByteArray, fileExtension: String): ReceiptDbo {
        val imageUrl = uploadImage(image, fileExtension)
        val receiptDbo = ReceiptDbo(status = ReceiptStatus.Uploaded, imgUrl = imageUrl, angle = null)
        receiptDboRepository.save(receiptDbo)

        return receiptDbo
    }

    private fun extractTextAndUpdateReceiptDbo(receiptDbo: ReceiptDbo): ReceiptDbo {
        val extractedText = ocrService.extractText(receiptDbo.imgUrl)
        val updatedReceiptDboAfterTextExtraction = receiptDbo.copy(angle = extractedText.angle, status = ReceiptStatus.TextExtracted)
        receiptDboRepository.save(updatedReceiptDboAfterTextExtraction)

        val lineDbos = extractedText.lines.map { mapToLineDbo(it.text, it.boundingBox, updatedReceiptDboAfterTextExtraction) }
        lineDboRepository.saveAll(lineDbos)

        return updatedReceiptDboAfterTextExtraction
    }

    private fun uploadImage(image: ByteArray, fileExtension: String): String {
        val uuid = UUID.randomUUID()
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