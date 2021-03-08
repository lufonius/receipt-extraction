package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.ReceiptStatus.*
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDboRepository
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemType
import org.springframework.stereotype.Component
import javax.persistence.EntityNotFoundException
import javax.transaction.Transactional

@Component
@Transactional
class ReceiptService(
        val receiptItemDboRepository: ReceiptItemDboRepository,
        val receiptDboRepository: ReceiptDboRepository
) {
    fun getReceipt(id: Int) = receiptDboRepository.getOne(id)

    fun getReceiptsNotDone(): List<ReceiptDbo> {
        return receiptDboRepository.findByStatusInOrderByUploadedAtDesc(listOf(Uploaded, Open, InProgress))
    }

    fun updateReceipt(updateDbo: ReceiptDbo): ReceiptDbo {
        if(receiptDboRepository.existsById(updateDbo.id)) {
            return receiptDboRepository.save(updateDbo)
        } else {
            throw EntityNotFoundException("could not find receipt entity with id ${updateDbo.id}")
        }
    }

    fun startReceiptExtraction(receiptId: Int): ReceiptDbo {
        val receiptDbo = receiptDboRepository.getOne(receiptId)

        val receiptDboInProgress = receiptDbo.copy(
                status = InProgress
        )

        return receiptDboRepository.save(receiptDboInProgress)
    }

    fun endReceiptExtraction(receiptId: Int): ReceiptDbo {
        val receiptDbo = receiptDboRepository.getOne(receiptId)

        val receiptDboDone = receiptDbo.copy(
                status = Done
        )

        return receiptDboRepository.save(receiptDboDone)
    }

    fun upsertReceiptItem(dbo: ReceiptItemDbo): ReceiptItemDbo {
        validateReceiptItem(dbo)
        return receiptItemDboRepository.save(dbo)
    }

    fun deleteReceiptItem(id: Int) {
        validateBeforeDelete(id)
        receiptItemDboRepository.deleteById(id)
    }

    /**
     * The receipt item table is quite a general container, that's why have a lot of validation rules for it
     */
    // TODO: validate for format
    // TODO: validate for setting line id but not the value and vice versa
    private fun validateReceiptItem(dbo: ReceiptItemDbo) {
        val receiptOfItem = dbo.receipt
        if (receiptOfItem.status != InProgress) {
            throw Exception("You can only add ReceiptItems to Receipts which have the status 'InProgress'")
        }

        if (dbo.type == ReceiptItemType.Category && dbo.category == null) {
            throw Exception("If you specify a ReceiptItem Type of 'Category', you have to pass a category")
        }

        if (dbo.type == ReceiptItemType.Tax && dbo.category != null) {
            throw Exception("If you specify a ReceiptItem Type of 'Tax', you must not pass a category")
        }

        if (dbo.valueLine != null && dbo.labelLine != null) {
            if (dbo.valueLine?.id == dbo.labelLine?.id) {
                throw Exception("amount and label cannot be the same box on the receipt. select different lines.")
            }
        }
    }

    private fun validateBeforeDelete(id: Int) {
        val receiptItem = receiptItemDboRepository.getOne(id)

        if (receiptItem.type == ReceiptItemType.Total || receiptItem.type == ReceiptItemType.Date) {
            throw Exception("receipt items with type ${receiptItem.type} must always be present and cannot be deleted")
        }
    }
}