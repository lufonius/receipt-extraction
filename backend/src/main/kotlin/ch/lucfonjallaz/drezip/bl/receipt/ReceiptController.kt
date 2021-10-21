package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.init.InitReceiptService
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDto
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemMapper
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
// TODO: make configurable on a per-environment basis
@CrossOrigin("*")
class ReceiptController(
        val initReceiptService: InitReceiptService,
        val receiptService: ReceiptService,
        val receiptItemMapper: ReceiptItemMapper,
        val receiptMapper: ReceiptMapper
) {

    @PostMapping("/receipt/init", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun initReceipt(@RequestPart("image") image: MultipartFile): ReceiptDto {
        val imageFileExtension = image.originalFilename?.split('.')?.lastOrNull() ?: throw Exception("file extension not specified")

        val receiptDbo = initReceiptService.initReceipt(image.bytes, imageFileExtension)

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

    @GetMapping("/receipt/{id}")
    fun getReceipt(@PathVariable id: Int) = receiptMapper.dtoFromDbo(receiptService.getReceipt(id))

    @GetMapping("/receipt/not-done")
    fun getReceiptsNotDone(): List<ReceiptListElementDto> {
        val receiptsNotDone = receiptService.getReceiptsNotDone()

        return receiptsNotDone.map { ReceiptListElementDto(
                id = it.id,
                status = it.status
        ) }
    }


    @PutMapping("/receipt/{id}")
    fun updateReceipt(@RequestBody dto: ReceiptDto, @PathVariable id: Int): ReceiptDto {
        val dbo = receiptMapper.dboFromDto(dto)
        val dboWithExplicitId = dbo.copy(id = id)

        val updatedDbo = receiptService.updateReceipt(dboWithExplicitId)

        return receiptMapper.dtoFromDbo(updatedDbo)
    }

    @PostMapping("/receipt/item")
    fun createReceiptItem(@RequestBody dto: ReceiptItemDto): ReceiptItemDto {
        val dbo = receiptItemMapper.dboFromDto(dto)

        val savedDbo = receiptService.upsertReceiptItem(dbo)

        return receiptItemMapper.dtoFromDbo(savedDbo)
    }

    @PutMapping("/receipt/item/{id}")
    fun updateReceiptItem(@RequestBody dto: ReceiptItemDto, @PathVariable id: Int): ReceiptItemDto {
        val dbo = receiptItemMapper.dboFromDto(dto)
        val dboWithExplicitId = dbo.copy(id = id)

        val updatedDbo = receiptService.upsertReceiptItem(dboWithExplicitId)
        return receiptItemMapper.dtoFromDbo(updatedDbo)
    }

    @DeleteMapping("/receipt/item/{id}")
    fun deleteReceiptItem(@PathVariable id: Int) = receiptService.deleteReceiptItem(id)
}