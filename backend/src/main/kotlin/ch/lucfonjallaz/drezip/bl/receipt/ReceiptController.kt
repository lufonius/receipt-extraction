package ch.lucfonjallaz.drezip.bl.receipt

import org.springframework.http.MediaType
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
class ReceiptController(val receiptService: ReceiptService) {

    @PostMapping("/initReceipt", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun initReceipt(@RequestPart("file") file: MultipartFile): ReceiptDto {
        val fileExtension = file.originalFilename?.split('.')?.lastOrNull() ?: throw Exception("file extension not specified")

        val receiptDbo = receiptService.initReceipt(file.bytes, fileExtension)

        return ReceiptDto.fromDbo(receiptDbo)
    }
}