package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.auth.UserDbo
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptStatus.*
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDboRepository
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

    fun getReceiptsNotDone(userDbo: UserDbo): List<ReceiptDbo> {
        return receiptDboRepository.findByStatusInAndUserOrderByUploadedAtDesc(listOf(Uploaded, Open, InProgress), userDbo)
    }

    fun updateReceipt(updateDbo: ReceiptDbo): ReceiptDbo {
        if (receiptDboRepository.existsById(updateDbo.id)) {
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

        if (dbo.valueLine != null && dbo.labelLine != null) {
            if (dbo.valueLine?.id == dbo.labelLine?.id) {
                throw Exception("amount and label cannot be the same box on the receipt. select different lines.")
            }
        }
    }
}