package ch.lucfonjallaz.drezip.bl.receipt.item

import ch.lucfonjallaz.drezip.auth.UserDbo
import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import org.springframework.stereotype.Component
import javax.persistence.EntityManager

@Component
class ReceiptItemMapper(val entityManager: EntityManager) {
    fun dboFromDto(dto: ReceiptItemDto, userDbo: UserDbo): ReceiptItemDbo {
        return ReceiptItemDbo(
                id = dto.id,
                label = dto.label,
                labelLine = dto.labelLineId?.let { entityManager.getReference(LineDbo::class.java, dto.labelLineId) },
                price = dto.price,
                valueLine = dto.valueLineId?.let { entityManager.getReference(LineDbo::class.java, dto.valueLineId) },
                category = dto.categoryId?.let { entityManager.getReference(CategoryDbo::class.java, dto.categoryId) },
                receipt = entityManager.getReference(ReceiptDbo::class.java, dto.receiptId),
                user = userDbo
        )
    }

    fun dtoFromDbo(dbo: ReceiptItemDbo) = ReceiptItemDto(
        id = dbo.id,
        label = dbo.label,
        labelLineId = dbo.labelLine?.id,
        price = dbo.price,
        valueLineId = dbo.valueLine?.id,
        categoryId = dbo.category?.id,
        receiptId = dbo.receipt.id
    )
}