package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.init.InitReceiptService
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDto
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemMapper
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
class ReceiptController(
        val initReceiptService: InitReceiptService,
        val receiptService: ReceiptService,
        val receiptItemMapper: ReceiptItemMapper,
        val receiptMapper: ReceiptMapper
) {

    /***
     * The user begins to extract text from the receipt
     */
    @PostMapping("/receipt/init", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun initReceipt(@RequestPart("file") file: MultipartFile): ReceiptDto {
        val fileExtension = file.originalFilename?.split('.')?.lastOrNull() ?: throw Exception("file extension not specified")

        val receiptDbo = initReceiptService.initReceipt(file.bytes, fileExtension)

        return receiptMapper.dtoFromDbo(receiptDbo)
    }

    @PostMapping("/receipt/start/{receiptId}")
    fun startReceiptExtraction(@PathVariable receiptId: Int): ReceiptDto {
        val receiptDbo = receiptService.startReceiptExtraction(receiptId)

        return receiptMapper.dtoFromDbo(receiptDbo)
    }

    @PostMapping("/receipt/end/{receiptId}")
    fun endReceiptExtraction(@PathVariable receiptId: Int): ReceiptDto {
        val receiptDbo = receiptService.endReceiptExtraction(receiptId)

        return receiptMapper.dtoFromDbo(receiptDbo)
    }

    /***
     * When the user wants to continue editing a receipt, he needs to get the details
     */
    @GetMapping("/receipt/{id}")
    fun getReceipt(@PathVariable id: Int) = receiptMapper.dtoFromDbo(receiptService.getReceipt(id))

    /***
     * When the user updates the total or the date afterwards
     */
    @PutMapping("/receipt/{id}")
    fun updateReceipt(@RequestBody dto: ReceiptDto, @PathVariable id: Int): ReceiptDto {
        val dbo = receiptMapper.dboFromDto(dto)
        val dboWithExplicitId = dbo.copy(id = id)

        val updatedDbo = receiptService.updateReceipt(dboWithExplicitId)

        return receiptMapper.dtoFromDbo(updatedDbo)
    }

    /***
     * When the users select a new item on the receipt and saves it
     */
    @PostMapping("/receipt/item")
    fun createReceiptItem(@RequestBody dto: ReceiptItemDto): ReceiptItemDto {
        val dbo = receiptItemMapper.dboFromDto(dto)

        val savedDbo = receiptService.upsertReceiptItem(dbo)

        return receiptItemMapper.dtoFromDbo(savedDbo)
    }

    /***
     * When the user makes changes to the receipt item
     */
    @PutMapping("/receipt/item/{id}")
    fun updateReceiptItem(@RequestBody dto: ReceiptItemDto, @PathVariable id: Int): ReceiptItemDto {
        val dbo = receiptItemMapper.dboFromDto(dto)
        val dboWithExplicitId = dbo.copy(id = id)

        val updatedDbo = receiptService.upsertReceiptItem(dboWithExplicitId)

        return receiptItemMapper.dtoFromDbo(updatedDbo)
    }

    /***
     * When the user deletes the receipt item
     */
    @DeleteMapping("/receipt/item/{id}")
    fun deleteReceiptItem(@PathVariable id: Int) = receiptService.deleteReceiptItem(id)
}