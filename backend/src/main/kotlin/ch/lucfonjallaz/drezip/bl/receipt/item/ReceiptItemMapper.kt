package ch.lucfonjallaz.drezip.bl.receipt.item

import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import org.springframework.stereotype.Component
import javax.persistence.EntityManager

@Component
class ReceiptItemMapper(val entityManager: EntityManager) {
    fun dboFromDto(dto: ReceiptItemDto): ReceiptItemDbo {
        return ReceiptItemDbo(
                id = dto.id,
                type = dto.type,
                label = dto.label,
                labelLine = dto.labelLineId?.let { entityManager.getReference(LineDbo::class.java, dto.labelLineId) },
                value = dto.value,
                valueLine = dto.valueLineId?.let { entityManager.getReference(LineDbo::class.java, dto.valueLineId) },
                category = dto.categoryId?.let { entityManager.getReference(CategoryDbo::class.java, dto.categoryId) },
                receipt = entityManager.getReference(ReceiptDbo::class.java, dto.receiptId)
        )
    }

    fun dtoFromDbo(dbo: ReceiptItemDbo) = ReceiptItemDto(
        id = dbo.id,
        type = dbo.type,
        label = dbo.label,
        labelLineId = dbo.labelLine?.id,
        value = dbo.value,
        valueLineId = dbo.valueLine?.id,
        categoryId = dbo.category?.id,
        receiptId = dbo.receipt.id
    )
}