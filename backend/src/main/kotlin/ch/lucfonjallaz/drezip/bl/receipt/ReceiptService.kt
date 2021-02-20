package ch.lucfonjallaz.drezip.bl.receipt

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

    fun updateReceipt(updateDbo: ReceiptDbo): ReceiptDbo {
        if(receiptDboRepository.existsById(updateDbo.id)) {
            return receiptDboRepository.save(updateDbo)
        } else {
            throw EntityNotFoundException("could not find receipt entity with id ${updateDbo.id}")
        }
    }

    fun upsertReceiptItem(dbo: ReceiptItemDbo): ReceiptItemDbo {
        validateReceiptItem(dbo)
        return receiptItemDboRepository.save(dbo)
    }

    fun deleteReceiptItem(id: Int) = receiptItemDboRepository.deleteById(id)

    private fun validateReceiptItem(dbo: ReceiptItemDbo) {
        if (dbo.type == ReceiptItemType.Category && dbo.category == null) {
            throw Exception("If you specify a ReceiptItem Type of 'Category', you have to pass a category")
        }

        if (dbo.amountLine.id == dbo.labelLine.id) {
            throw Exception("amount and label cannot be the same box on the receipt. select different lines.")
        }
    }
}